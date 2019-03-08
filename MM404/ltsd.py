#!/usr/bin/env python
# -*- coding: utf-8 -*-

# MM404 - ltsd.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import numpy as np
import scipy as sp

class LTSD_Detector():
    """
    LTSD Detector object used to determine if a given window of audio
    contains voice signals.

    Signal = window (array of frames)
    Frame = audio slice in window (array of floats)
    """

    def __init__(self, winsize, order, ratio=0.95, e0=100, e1=200, lambda0=15, lambda1=25):
        self.winsize = winsize
        self.window = sp.hanning(winsize)
        self.order = order
        self.windowidx = order
        self.avgnoise = None
        self.amplitude = {}

        # These are parameters for tuning the thresholds
        self._ratio = ratio
        self._e0 = e0
        self._e1 = e1
        self._lambda0 = lambda0
        self._lambda1 = lambda1

    def _get_amplitude(self, signal, l, idx):
        """Calculates the amplitude given the frame index and the offset"""
        if l+idx in self.amplitude:
            return self.amplitude[l+idx]
        else:
            amp = sp.absolute(sp.fft(signal[idx] * self.window))
            self.amplitude[l+idx] = amp
            return amp

    def _get_power(self, signal, l, idx):
        """Calculates the power given the frame index and the offset"""
        amp = self._get_amplitude(signal, l, idx)
        avgpow = 10*np.log10((np.average(amp) / (10e-7 * 20)) ** 2)
        return avgpow

    def _compute_noise_avg_spectrum(self, signal):
        """Calculates the noise average across the noise spectrum for a given signal"""
        avgamp = np.zeros(self.winsize)
        for frame in signal:
            avgamp += sp.absolute(sp.fft(frame * self.window))
        return avgamp / len(signal)

    def _ltse(self, signal, l, order):
        """Calculates the LTSE across a whole signal"""
        maxamp = np.zeros(self.winsize)
        for idx in range(-order, order+1):
            amp = self._get_amplitude(signal, l, idx)
            maxamp = np.maximum(maxamp, amp)
        return maxamp

    def _ltsd(self, signal, l, order):
        """Calculates the LTSD across a whole signal"""
        return 10.0*np.log10(np.sum(self._ltse(signal, l, order)**2/self.avgnoise)/len(self.avgnoise))

    def compute_window(self, signal):
        """Takes in a window of audio and returns true if a signal is detected within it"""
        self.windowidx += 1
        numframes = len(signal)
        ltsds = np.zeros(numframes)
        for offset in range(numframes):
            ltsd = self._ltsd(signal, self.windowidx+offset, self.order)
            power = self._get_power(signal, self.windowidx+offset, self.order)
            ltsds[offset] = self._is_signal(power, ltsd)
        return any(ltsds)

    def _is_signal(self, energy, ltsd):
        """
        Takes in the energy and ltsd of a frame and determines if it is above the threshold.
        If it is above the threshold given the noise context, it is considered a signal.
        """
        # print(energy, ltsd)
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
            lambdah = ((self._lambda0 - self._lambda1) / (self._e0 - self._e1)) * energy +\
                self._lambda0 - (self._lambda0 - self._lambda1) / (1 - self._e1/self._e0)
            # print(lambdah)
            if ltsd > lambdah:  # LTSD above calculated threshold for background energy state
                return True
            else:
                return False

    def compute_noise_spectrum(self, signal):
        """Wrapper to set the average noise given a signal"""
        self.avgnoise = self._compute_noise_avg_spectrum(signal)**2

    def update_noise_spectrum(self, signal):
        """Updates the average noise given a signal"""
        self.windowidx += 1
        numframes = len(signal)
        avgamp = np.zeros(self.winsize)
        for offset in range(numframes):
            avgamp += self._get_amplitude(signal, self.windowidx, offset)
        avgamp = avgamp / float(self.order*2 + 1)
        self.avgnoise = self.avgnoise * self._ratio + (avgamp**2)*(1.0-self._ratio)
