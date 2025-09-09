import React from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';

const Card = ({ _id, name = 'User', prompt = '', photo }) => (
  <article
    className="
      card relative group overflow-hidden rounded-2xl
      glass elevate transition-transform duration-200 ease-[var(--ease)]
      hover:-translate-y-1
    "
  >
    <img
      className="w-full h-auto object-cover rounded-2xl"
      src={photo}
      alt={prompt || 'Generated image'}
      loading="lazy"
      decoding="async"
    />

    {/* subtle hover ring */}
    <div
      className="
        pointer-events-none absolute inset-0 rounded-2xl
        ring-1 ring-transparent group-hover:ring-[hsl(var(--accent)/.35)]
        transition
      "
      aria-hidden="true"
    />

    {/* Overlay (visible on hover or keyboard focus) */}
    <div
      className="
        hidden group-hover:flex group-focus-within:flex
        flex-col gap-3
        absolute inset-x-2 bottom-2
        glass-strong rounded-xl p-4
        max-h-[85%]
      "
    >
      <p className="text-sm leading-6 overflow-y-auto prompt">
        {prompt}
      </p>

      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="
              w-9 h-9 flex justify-center items-center
              rounded-full text-sm font-semibold
              bg-[hsl(var(--accent)/.25)] text-[hsl(var(--fg))]
              border border-[hsl(var(--border)/.45)]
            "
            aria-hidden="true"
          >
            {(name || 'U').charAt(0).toUpperCase()}
          </div>
          <p className="text-sm opacity-90 truncate">{name}</p>
        </div>

        <button
          type="button"
          onClick={() => downloadImage(_id, photo)}
          className="btn px-2 py-2"
          aria-label="Download image"
        >
          <img
            src={download}
            alt=""
            className="w-5 h-5 object-contain invert"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </article>
);

export default Card;
