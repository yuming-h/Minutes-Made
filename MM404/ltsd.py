#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM404 - ltsd.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import numpy as np
import scipy as sp

class LTSD_Detector():
    def __init__(self, winsize, order, ratio=0.95, e0=50, e1=80, lambda0=30, lambda1=12):
        self.winsize = winsize
        self.window = sp.hanning(winsize)
        self.order = order
        self.windowidx = -1
        self.avgnoise = None
        self.amplitude = {}

        self._ratio = ratio
        self._e0 = e0
        self._e1 = e1
        self._lambda0 = lambda0
        self._lambda1 = lambda1

    def get_amplitude(self, signal, l):
        if l in self.amplitude:
            return self.amplitude[l]
        else:
            amp = sp.absolute(sp.fft(signal * self.window))
            self.amplitude[l] = amp
            return amp

    def get_power(self, signal, l):
        amp = self.get_amplitude(signal, l)
        avgpow = 10*np.log10((np.average(amp) / (10e-7 * 20)) ** 2)
        return avgpow

    def compute_noise_avg_spectrum(self, signal):
        avgamp = np.zeros(self.winsize)
        avgamp += sp.absolute(sp.fft(signal * self.window))

        if self.avgnoise is None:
            self.avgnoise = avgamp**2
        return (np.sqrt(self.avgnoise) + avgamp) / 2

    def ltse(self, signal, l, order):
        maxamp = np.zeros(self.winsize)
        for idx in range(l-order, l+order+1):
            amp = self.get_amplitude(signal, idx)
            maxamp = np.maximum(maxamp, amp)
        return maxamp

    def ltsd(self, signal, l, order):
        return 10.0*np.log10(np.sum(self.ltse(signal, l, order)**2/self.avgnoise)/len(self.avgnoise))

    def compute_frame(self, frame):
        self.windowidx += 1
        if self.windowidx < 20:
            self.avgnoise = self.compute_noise_avg_spectrum(frame)**2
            return 0  # Evals to false, but not False for debug purposes
        else:
            ltsd = self.ltsd(frame, self.windowidx, self.order)
            power = self.get_power(frame, self.windowidx)
            return self.is_signal(power, ltsd)

    def is_signal(self, energy, ltsd):
        if energy < self._e0:  # Background noise energy less than cleanest
            if ltsd > self._lambda0:  # LTSD above threshold for cleanest background energy state
                return True
            else:
                return False

        elif energy > self._e1:  # Background noise energy higher than nosiest
            if ltsd > self._lambda1:  # LTSD above threshold for nosiest background energy state
                return True
            else:
                return False

        else:  # Background noise energy in between cleanest and noisiest
            lambdah = ((self._lambda0 - self._lambda1) / (self._e0 - self._e1)) * e +\
                self._lambda0 - (self._lambda0 - self._lambda1) / (1 - self._e1/self._e0)
            if ltsd > lambdah:  # LTSD above calculated threshold for background energy state
                return True
            else:
                return False

    def update_noise_spectrum(self, signal):
        avgamp = np.zeros(self.winsize)
        for idx in range(l - self._order, l + self._order + 1):
            avgamp += self.get_amplitude(signal, idx)
        avgamp = avgamp / float(self._order*2 + 1)
        self.avgnoise = self.avgnoise * self._ratio + (avgamp**2)*(1.0-self._ratio)

