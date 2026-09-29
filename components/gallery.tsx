"use client";
import { useState } from "react";
import { useDemo } from "./provider";
import { Modal } from "./shell";
import { PageHero } from "./public-pages";
import { GalleryCarousel } from "./gallery-carousel";
export function Gallery() {
  const { data } = useDemo();
  const [selected, setSelected] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const images = [
    ...data.gallery,
    ...[
      ["convocation-pics.jpg", "Convocation celebrations"],
      ["dsc_0650.jpg", "Students at Equinox"],
      ["table_tennis_team.jpg", "The table tennis team"],
      ["reception_area.jpg", "Inside the institute"],
      ["lab2_1.jpg", "Learning in the laboratory"],
      ["republic_day22.jpg", "Republic Day on campus"],
      ["equinox1.jpg", "Equinox on the main ground"],
      ["lab1.jpg", "The engineering laboratory"],
      ["2nd-convocation-group-pic.jpg", "Graduating cohort"],
      ["girls_hostel_galary_2.jpg", "Life in the hostel"],
      ["landing-inner-campustour.jpg", "A walk through campus"],
      ["reception_area.jpg", "Reception and common area"],
    ].map(([src, alt]) => ({ src: "/assets/images/" + src, alt })),
  ];
  // The carousel repeats the shared sequence when it runs out, so dedupe to
  // keep the ring even and every card distinct.
  const slides = images.filter(
    (image, index) =>
      images.findIndex((other) => other.src === image.src) === index,
  );
  return (
    <>
      <PageHero title="A place. A people. A feeling." kicker="CAMPUS GALLERY" />
      <section className="section">
        <span className="eyebrow">MOMENTS FROM AROUND CAMPUS</span>
        <h2 style={{ marginBottom: 8 }}>
          Drag, swipe, or use the arrow keys to <em>look around.</em>
        </h2>
        <GalleryCarousel
          slides={slides}
          onSelect={(slide) => setSelected({ src: slide.src, alt: slide.alt })}
        />
      </section>
      <section className="section">
        <span className="eyebrow">EVERY PHOTOGRAPH</span>
        <div className="gallery-grid">
          {slides.map((i, n) => (
            <button
              className="gallery-item"
              onClick={() => setSelected(i)}
              key={n}
            >
              <img loading="lazy" src={i.src} alt={i.alt} />
              <span>{i.alt} ↗</span>
            </button>
          ))}
        </div>
      </section>
      <Modal
        title={selected?.alt || "Campus photograph"}
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
      >
        {selected && (
          <img
            className="lightbox-image"
            src={selected.src}
            alt={selected.alt}
          />
        )}
      </Modal>
    </>
  );
}
