"use client";

import { useState, useEffect, useCallback } from "react";

export interface FavoriteEntry {
  url: string;
  label: string;
  addedAt: number;
}

const STORAGE_KEY = "mahjong-ev-favorites";

function loadFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(entries: FavoriteEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const addFavorite = useCallback((url: string, label: string) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.url === url)) return prev;
      const next = [{ url, label, addedAt: Date.now() }, ...prev];
      saveFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((url: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.url !== url);
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (url: string) => favorites.some((f) => f.url === url),
    [favorites],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

export function FavoriteButton({
  url,
  defaultLabel,
  isFavorite,
  onAdd,
  onRemove,
}: {
  url: string;
  defaultLabel: string;
  isFavorite: boolean;
  onAdd: (url: string, label: string) => void;
  onRemove: (url: string) => void;
}) {
  const handleClick = () => {
    if (isFavorite) {
      onRemove(url);
    } else {
      onAdd(url, defaultLabel);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={{
        background: isFavorite ? "#fdf3dc" : "var(--c-bg)",
        color: isFavorite ? "#a87618" : "var(--c-text-dim)",
      }}
      title={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
    >
      {isFavorite ? "★ お気に入り済み" : "☆ お気に入りに追加"}
    </button>
  );
}

export function FavoritesList({
  favorites,
  onSelect,
  onRemove,
}: {
  favorites: FavoriteEntry[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
}) {
  if (favorites.length === 0) return null;

  return (
    <div
      className="rounded-2xl"
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
      }}
    >
      <div
        className="px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--c-border)" }}
      >
        <span
          className="text-[11px] font-bold tracking-[0.1em]"
          style={{ color: "var(--c-text-dim)" }}
        >
          ★ お気に入り ({favorites.length})
        </span>
      </div>
      <div>
        {favorites.map((fav, i) => (
          <div
            key={fav.url}
            className="flex items-center justify-between px-4 py-2"
            style={{
              borderTop:
                i === 0 ? "none" : "1px solid var(--c-border)",
            }}
          >
            <button
              type="button"
              onClick={() => onSelect(fav.url)}
              className="flex-1 text-left"
            >
              <p className="text-sm font-semibold truncate">{fav.label}</p>
              <p
                className="text-[10px] truncate font-num"
                style={{ color: "var(--c-text-faint)" }}
              >
                {fav.url}
              </p>
            </button>
            <button
              type="button"
              onClick={() => onRemove(fav.url)}
              className="ml-2 text-sm"
              style={{ color: "var(--c-text-faint)" }}
              title="削除"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
