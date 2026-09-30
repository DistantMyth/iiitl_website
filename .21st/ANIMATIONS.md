# Site animation choices

Inspiration explored on 21st.dev:

- [Text Effect by Julien Thibeaut](https://21st.dev/@ibelick/components/text-effect): per-word entrance. Adapted locally to the existing GSAP runtime, with the complete headline retained for assistive technology.
- [Magnetic Button by Bundui](https://21st.dev/community/components/bundui/magnetic-button): retrieved using `21st get 1507`. Adapted to existing links with movement capped at 7px horizontally and 5px vertically, pointer-local listeners, and reset on blur/leave/scroll. Mouse only.
- [Unlumen UI Count Up and scroll reveals](https://21st.dev/blog/unlumen-ui-components): once-only entrance and count-up patterns. Program counts animate; the founding year remains literal.

Implementation lives in `components/site-motion.tsx`, mounted in the public `Shell`. Existing GSAP handles all new motion. No additional runtime dependencies. Text remains visible with JavaScript disabled. Media queries revert effects when reduced motion is enabled. Route changes clean up observers, listeners, and GSAP styles.

Validation: TypeScript, project tests, browser checks at 1440px and 390px, touch input, reduced motion, program tab interaction, campus image loading, and horizontal overflow. The CLI review reports existing CSS token literals, artwork alt-text detection, and search-modal autofocus; no findings in the new motion component.
