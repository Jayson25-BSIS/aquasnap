'use client';

import React, { JSX } from 'react';
import { Heart, Waves, Fish } from 'lucide-react';

export function Footer(): JSX.Element {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-teal-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Team Credit */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Waves className="w-6 h-6 text-cyan-400" />
              <Fish className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <p className="text-lg font-semibold">Built with ❤️ by</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                TheATLANTIS
              </p>
            </div>
          </div>

          {/* AQUASNAP Branding */}
          <div className="text-center">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <span className="text-3xl">🌊</span>
              <span className="text-xl font-bold">AQUASNAP</span>
              <span className="text-3xl">🐠</span>
            </div>
            <p className="text-sm text-blue-200">
              Protecting Marine Life Through Education
            </p>
          </div>

          {/* Year and Mission */}
          <div className="text-center md:text-right">
            <p className="text-sm text-blue-200">
              © 2024 AQUASNAP
            </p>
            <p className="text-xs text-cyan-300 flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>Conservation Through Gaming</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 mt-6 pt-4">
          <p className="text-center text-xs text-blue-300">
            Supporting SDG 14: Life Below Water | Making Ocean Conservation Fun & Accessible
          </p>
        </div>
      </div>
    </footer>
  );
}   