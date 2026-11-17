import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  Box,
  ExternalLink,
  Layers,
  Eye,
} from 'lucide-react';
import { ExoCaseFile, ExoWebLink } from '../lib/exoStore';

export type ViewerItem =
  | { kind: 'file'; data: ExoCaseFile }
  | { kind: 'link'; data: ExoWebLink };

interface Exo3DViewerProps {
  items: ViewerItem[];
  activeIndex: number;
  onChangeIndex: (idx: number) => void;
  onBackToAllFiles?: () => void;
}

export const Exo3DViewer: React.FC<Exo3DViewerProps> = ({
  items,
  activeIndex,
  onChangeIndex,
  onBackToAllFiles,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotX, setRotX] = useState(22);
  const [rotY, setRotY] = useState(-35);
  const [zoom, setZoom] = useState(1);
  const [wireframe, setWireframe] = useState(false);
  const [showContacts, setShowContacts] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentItem = items[activeIndex] || items[0];

  // Keyboard shortcuts: Left/Right arrows to step through files, F for fullscreen
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft' && items.length > 1) {
        onChangeIndex((activeIndex - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowRight' && items.length > 1) {
        onChangeIndex((activeIndex + 1) % items.length);
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreen((v) => !v);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, items.length, isFullscreen, onChangeIndex]);

  // Render interactive 3D dental CAD mesh on canvas
  useEffect(() => {
    if (!currentItem || currentItem.kind !== 'file') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle dark CAD studio background grid
    const grad = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w * 0.65);
    grad.addColorStop(0, '#1a2038');
    grad.addColorStop(1, '#0d0d1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw reference occlusal grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    const step = 36;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;
    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      // Rotate Y
      const x1 = x * Math.cos(radY) - z * Math.sin(radY);
      const z1 = x * Math.sin(radY) + z * Math.cos(radY);
      // Rotate X
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);
      const scale = (360 / (420 + z2)) * zoom;
      return {
        sx: cx + x1 * scale,
        sy: cy + y2 * scale,
        z: z2,
      };
    };

    const isDeliverable = currentItem.data.section === 'DELIVERABLE';
    const unitsCount = currentItem.data.meshType === 'full_arch' ? 6 : 3;
    const spacing = currentItem.data.meshType === 'full_arch' ? 44 : 68;

    for (let u = 0; u < unitsCount; u++) {
      const offsetX = (u - (unitsCount - 1) / 2) * spacing;
      const archCurveZ =
        currentItem.data.meshType === 'full_arch'
          ? Math.pow(u - (unitsCount - 1) / 2, 2) * 14
          : 0;

      const rings = 9;
      const segs = 18;
      const pts: { sx: number; sy: number; z: number }[][] = [];

      for (let r = 0; r <= rings; r++) {
        const v = r / rings;
        const y = (v - 0.5) * 66;
        // Anatomical crown profile with cervical margin & occlusal cusps
        const profileRadius =
          26 * Math.sin(v * Math.PI * 0.85 + 0.2) +
          (v < 0.25 ? 4 * Math.cos(v * 16) : 0);
        const row: { sx: number; sy: number; z: number }[] = [];

        for (let s = 0; s <= segs; s++) {
          const theta = (s / segs) * Math.PI * 2;
          const cuspMod =
            v < 0.35 ? 3.5 * Math.sin(theta * 4) * (1 - v * 2) : 0;
          const rx = offsetX + (profileRadius + cuspMod) * Math.cos(theta);
          const rz = archCurveZ + (profileRadius * 0.85 + cuspMod) * Math.sin(theta);
          row.push(project(rx, y, rz));
        }
        pts.push(row);
      }

      // Draw quads
      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segs; s++) {
          const p1 = pts[r][s];
          const p2 = pts[r][s + 1];
          const p3 = pts[r + 1][s + 1];
          const p4 = pts[r + 1][s];

          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.lineTo(p4.sx, p4.sy);
          ctx.closePath();

          if (!wireframe) {
            const shade = Math.max(0.35, Math.min(0.95, 0.7 - p1.z / 280));
            ctx.fillStyle = isDeliverable
              ? `rgba(${Math.round(235 * shade)}, ${Math.round(242 * shade)}, ${Math.round(255 * shade)}, 0.92)`
              : `rgba(${Math.round(215 * shade)}, ${Math.round(225 * shade)}, ${Math.round(240 * shade)}, 0.88)`;
            ctx.fill();
          }

          ctx.strokeStyle = wireframe
            ? '#38bdf8'
            : isDeliverable
            ? 'rgba(5, 75, 206, 0.28)'
            : 'rgba(148, 163, 184, 0.22)';
          ctx.lineWidth = wireframe ? 0.9 : 0.6;
          ctx.stroke();
        }
      }

      // Draw crimson/blue margin line at cervical base
      const marginRing = pts[rings - 1];
      if (marginRing) {
        ctx.beginPath();
        marginRing.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        });
        ctx.strokeStyle = isDeliverable ? '#10b981' : '#054bce';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // Optional occlusal contact points
      if (showContacts) {
        const contactPt = project(offsetX + 5, -26, archCurveZ + 3);
        ctx.beginPath();
        ctx.arc(contactPt.sx, contactPt.sy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
      }
    }
  }, [currentItem, rotX, rotY, zoom, wireframe, showContacts]);

  const handleDownload = () => {
    if (!currentItem || currentItem.kind !== 'file') return;
    const content = `solid ${currentItem.data.name}\n  facet normal 0 0 1\n    outer loop\n      vertex 0 0 0\n      vertex 1 0 0\n      vertex 0 1 0\n    endloop\n  endfacet\nendsolid ${currentItem.data.name}`;
    const blob = new Blob([content], { type: 'application/sla' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentItem.data.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentItem) return null;

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#0d0d1a] flex flex-col'
          : 'relative rounded-2xl border border-border bg-[#0d0d1a] overflow-hidden flex flex-col'
      }`}
    >
      {/* Top Viewer Control Bar (Exact ExoConnect Help Center spec: All files on top-left; File name + Download + Fullscreen on top-right) */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#0d0d1a] flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          {onBackToAllFiles && (
            <button
              type="button"
              onClick={onBackToAllFiles}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>All files</span>
            </button>
          )}
          <span className="text-xs text-white/50 tabular-nums">
            {activeIndex + 1} / {items.length}
          </span>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold text-white truncate max-w-[240px] sm:max-w-md">
            {currentItem.kind === 'file' ? currentItem.data.name : currentItem.data.label}
          </span>

          {currentItem.kind === 'file' ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          ) : (
            <a
              href={currentItem.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in new tab</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            title="Fullscreen (Press F)"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] flex items-center justify-center select-none">
        {currentItem.kind === 'file' ? (
          <>
            <canvas
              ref={canvasRef}
              width={860}
              height={460}
              onMouseDown={(e) => {
                setDragging(true);
                setLastPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                if (!dragging) return;
                const dx = e.clientX - lastPos.x;
                const dy = e.clientY - lastPos.y;
                setRotY((r) => r + dx * 0.6);
                setRotX((r) => Math.max(-75, Math.min(75, r + dy * 0.6)));
                setLastPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />

            {/* Bottom Floating 3D Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1.5 bg-black/65 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white/80">
                <Box className="w-3.5 h-3.5 text-primary" />
                <span>Drag to spin 3D mesh · Use ← / → arrow keys to step files</span>
              </div>

              <div className="pointer-events-auto flex items-center gap-1.5 bg-black/65 backdrop-blur-md border border-white/15 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setWireframe((v) => !v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                    wireframe ? 'bg-primary text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Wireframe
                </button>
                <button
                  type="button"
                  onClick={() => setShowContacts((v) => !v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                    showContacts ? 'bg-emerald-600 text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  Contacts & Margin
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
                  className="px-2 py-1 rounded-lg text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
                  className="px-2 py-1 rounded-lg text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRotX(22);
                    setRotY(-35);
                    setZoom(1);
                  }}
                  className="p-1 rounded-lg text-white/70 hover:text-white cursor-pointer"
                  title="Reset view"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Embedded Digital Design Web Link Preview */
          <div className="w-full h-full p-6 sm:p-10 flex flex-col items-center justify-center text-center text-white space-y-4">
            <div className="size-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-lg">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                Embedded Digital Design Web Link
              </span>
              <h3 className="text-lg font-bold text-white pt-1">
                {currentItem.data.label}
              </h3>
              <p className="text-xs text-white/60 break-all">{currentItem.data.url}</p>
            </div>
            <p className="text-xs text-white/70 max-w-md leading-relaxed">
              Interactive exocad / 3Shape web deliverable attached to this case. Review occlusal anatomy, margin adaptation, and pontic emergence directly inside the Case Workspace.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onChangeIndex(0)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer inline-flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Inspect 3D STL Mesh
              </button>
              <a
                href={currentItem.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-white inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Full Web Link
              </a>
            </div>
          </div>
        )}

        {/* Left / Right Step Arrows on either side of the preview */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                onChangeIndex((activeIndex - 1 + items.length) % items.length)
              }
              aria-label="Previous file"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChangeIndex((activeIndex + 1) % items.length)}
              aria-label="Next file"
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
