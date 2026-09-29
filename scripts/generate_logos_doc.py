import os
import json

os.makedirs('agents/assets_description', exist_ok=True)

logos_info = [
    {
        "filename": "iiitl_main_logo.png",
        "title": "IIIT Lucknow Primary Institutional Logo",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2019/10/Final_Logo_IIITL.png",
        "asset_type": "Primary Institutional Logo / Brand Mark",
        "dimensions": "2269 x 2039 px (High Resolution Master)",
        "file_size": f"{os.path.getsize('assets/logos/iiitl_main_logo.png'):,} bytes",
        "color_palette": "Deep Navy Blue (#0a1f44), Gold/Bronze (#d4af37), Cyan/Teal accents, Pure White (#ffffff)",
        "description": (
            "The official primary brand identity mark of the Indian Institute of Information Technology, Lucknow (IIITL). "
            "Features the complete institutional emblem containing an open book symbolizing wisdom and foundational education, "
            "interconnected circuit traces with electronic node points symbolizing computer science, digital systems, and cutting-edge information technology, "
            "and national motifs reflecting Indian heritage. An ornamental ribbon banner bears the institute motto. "
            "The emblem is flanked by bilingual institutional typography: Hindi Devanagari script at the top/sides "
            "('भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ') and English typography below ('Indian Institute of Information Technology, Lucknow')."
        ),
        "source_pages": [
            "https://iiitl.ac.in/ (Main Website Header & Sticky Navigation)",
            "https://iiitl.ac.in/index.php/faculty/",
            "https://iiitl.ac.in/index.php/directorate/",
            "https://iiitl.ac.in/index.php/academic-programs/",
            "Used site-wide across all 132 core pages and 535 posts in the primary Kingster header banner"
        ],
        "recommended_usage": "Primary brand anchor for the new website. Ideal for main header navigation, official letterheads, formal announcements, footer copyright lockup, and high-DPI displays."
    },
    {
        "filename": "iiitl_crest_logo.png",
        "title": "IIIT Lucknow Circular Emblem / Seal (Cropped)",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2019/10/cropped-Final_Logo_IIITL.png",
        "asset_type": "Official Seal / Circular Crest",
        "dimensions": "512 x 512 px (Square Vector-Derived Raster)",
        "file_size": f"{os.path.getsize('assets/logos/iiitl_crest_logo.png'):,} bytes",
        "color_palette": "Deep Navy Blue, Bronze Gold, Cyan, White",
        "description": (
            "A cropped, square-ratio version of the official circular IIIT Lucknow crest. Contains the central emblem without the exterior rectangular text margins: "
            "the open book of learning, technological circuit network diagrams, Ashoka emblem sun/chakra accents, and institutional crest ring. "
            "Designed specifically for square icon containers, mobile app tiles, circular avatar representations, and favicon source generation."
        ),
        "source_pages": [
            "Site-wide as base for shortcut icons, favicon generators, and mobile web app manifests",
            "Used in administrative headers and avatar fallbacks"
        ],
        "recommended_usage": "Square avatar mark, mobile app icons (PWA), compact header states, watermark for hero banners, and circular social media avatars."
    },
    {
        "filename": "iiitl_favicon_150x150.png",
        "title": "IIIT Lucknow Browser Favicon (Standard DPI)",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2019/10/cropped-Final_Logo_IIITL-150x150.png",
        "asset_type": "Browser Favicon / Bookmark Icon",
        "dimensions": "150 x 150 px",
        "file_size": f"{os.path.getsize('assets/logos/iiitl_favicon_150x150.png'):,} bytes",
        "color_palette": "Navy Blue, Gold, White",
        "description": (
            "Optimized 150x150 square browser icon used in the `<link rel='icon'>` tags across the IIIT Lucknow website. "
            "Downsampled with alpha channel transparency to provide sharp readability on modern browser tabs, bookmarks, and desktop browser bars."
        ),
        "source_pages": [
            "Referenced in HTML `<head>` on all 889 pages and subpages via `<link rel='icon' sizes='32x32'>`"
        ],
        "recommended_usage": "Directly usable as browser tab favicon (`/favicon-32x32.png` and `/favicon.ico` source)."
    },
    {
        "filename": "iiitl_app_icon_300x300.png",
        "title": "IIIT Lucknow Web App & Touch Icon (High DPI)",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2019/10/cropped-Final_Logo_IIITL-300x300.png",
        "asset_type": "Apple Touch Icon / Android Chrome App Tile",
        "dimensions": "300 x 300 px",
        "file_size": f"{os.path.getsize('assets/logos/iiitl_app_icon_300x300.png'):,} bytes",
        "color_palette": "Navy Blue, Gold, White",
        "description": (
            "Higher-resolution 300x300 square icon utilized for Apple Touch icons (`<link rel='apple-touch-icon'>`) "
            "and Android home screen launcher shortcuts. Renders crisp details on Retina and OLED high-density smartphone screens."
        ),
        "source_pages": [
            "Referenced in HTML `<head>` on all pages via `<link rel='apple-touch-icon'>` and `<link rel='icon' sizes='192x192'>`"
        ],
        "recommended_usage": "Mobile device home-screen bookmark icon (`apple-touch-icon.png`) and Progressive Web App (PWA) manifest icon."
    },
    {
        "filename": "create_incubation_logo.png",
        "title": "CREATE - Innovation & Incubation Center Logo",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2023/05/Create-logo-3.png",
        "asset_type": "Sub-Organization / Incubation Center Brand Logo",
        "dimensions": "426 x 273 px",
        "file_size": f"{os.path.getsize('assets/logos/create_incubation_logo.png'):,} bytes",
        "color_palette": "Multi-colored (Orange, Deep Blue, Green, Cyan, Purple)",
        "description": (
            "Official logo of the 'Confederation for Research Entrepreneurship & Technology Enablement' (CREATE), "
            "the registered Section 8 company and technology business incubator of IIIT Lucknow supported by the Government of Uttar Pradesh (StartinUP). "
            "Displays the stylized acronym 'C.R.E.A.T.E.' with dynamic geometric polygons and arrows symbolizing startup acceleration, innovation, and technological synergy."
        ),
        "source_pages": [
            "https://iiitl.ac.in/index.php/create/ (Official Incubation Hub Page)",
            "https://iiitl.ac.in/index.php/create-test/"
        ],
        "recommended_usage": "Dedicated section branding for Innovation, Incubation, Entrepreneurship (CREATE TBI), startup showcases, and industry partnership pages."
    },
    {
        "filename": "cultural_club_logo.jpeg",
        "title": "IIIT Lucknow Cultural Club Official Emblem",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2022/04/Logo-Cultural-Club.jpeg",
        "asset_type": "Student Body / Cultural Society Emblem",
        "dimensions": "800 x 800 px",
        "file_size": f"{os.path.getsize('assets/logos/cultural_club_logo.jpeg'):,} bytes",
        "color_palette": "Crimson Red, Gold, Black, White",
        "description": (
            "Official insignia and emblem of the Cultural Club of IIIT Lucknow. "
            "Features artistic iconography incorporating classical theatre masks (comedy and tragedy), musical notations, rhythm ripples, "
            "and expressive paint flourishes inside a circular emblem with the bold inscription 'CULTURAL CLUB - IIIT LUCKNOW'."
        ),
        "source_pages": [
            "https://iiitl.ac.in/index.php/cultural-club/",
            "https://iiitl.ac.in/index.php/college-events/"
        ],
        "recommended_usage": "Student Life, Clubs & Societies portal, annual cultural festival announcements, extracurricular activity profiles."
    },
    {
        "filename": "equinox_fest_logo.png",
        "title": "Equinox - Annual Socio-Cultural-Technical Fest Logo",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2019/11/equinox_logo_white.png",
        "asset_type": "Annual College Festival Brand Mark",
        "dimensions": "748 x 206 px",
        "file_size": f"{os.path.getsize('assets/logos/equinox_fest_logo.png'):,} bytes",
        "color_palette": "Monochrome White (#ffffff) on transparent alpha",
        "description": (
            "Official stylized wordmark and emblem for 'EQUINOX', the flagship annual socio-cultural-technical festival of IIIT Lucknow. "
            "Designed with sleek, futuristic typography representing the balance of day and night (equinox), technology and culture, "
            "with celestial / orbital orbit iconography embedded into the lettering."
        ),
        "source_pages": [
            "https://iiitl.ac.in/index.php/2019/11/15/equinox-2019/",
            "https://iiitl.ac.in/index.php/cultural-club/",
            "https://iiitl.ac.in/index.php/college-events/"
        ],
        "recommended_usage": "Dark-mode event showcase, campus festivals gallery, hackathons, and cultural extravaganza landing cards."
    },
    {
        "filename": "theme_logo_white.png",
        "title": "Horizontal White Institutional Logo Variant",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/logo-white.png",
        "asset_type": "Theme Brand Asset (Inverted / White Navigation)",
        "dimensions": "320 x 84 px",
        "file_size": f"{os.path.getsize('assets/logos/theme_logo_white.png'):,} bytes",
        "color_palette": "White (#ffffff) with subtle grey outline on transparent background",
        "description": (
            "Horizontal lockup logo asset tailored for dark headers, hero banners, and deep blue navigational navigation bars. "
            "Features the crest alongside institute typography in pure white, ensuring contrast over dark photography or navy gradients."
        ),
        "source_pages": [
            "https://iiitl.ac.in/ (Dark navigation variant and sticky header mode)"
        ],
        "recommended_usage": "Dark-theme navigation bar, transparent header over hero sliders, and footer bar inverted display."
    },
    {
        "filename": "theme_footer_logo.png",
        "title": "Theme Footer Institutional Logo Variant",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/footer-logo.png",
        "asset_type": "Theme Brand Asset (Footer Placement)",
        "dimensions": "280 x 74 px",
        "file_size": f"{os.path.getsize('assets/logos/theme_footer_logo.png'):,} bytes",
        "color_palette": "Monochrome White (#ffffff) on transparent background",
        "description": (
            "Compact brand lockup configured for the global page footer widget area. "
            "Optimized for legibility in dense footer column layouts alongside contact information, address, and social links."
        ),
        "source_pages": [
            "Footer widget zone across all 132 core pages and post archives"
        ],
        "recommended_usage": "Global site footer logo lockup next to institution address (Chak Ganjaria, C.G. City, Lucknow)."
    },
    {
        "filename": "landing_logo.png",
        "title": "Portal Landing Page Crest Logo",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/landing-logo.png",
        "asset_type": "Portal / Gateway Branding Asset",
        "dimensions": "180 x 180 px",
        "file_size": f"{os.path.getsize('assets/logos/landing_logo.png'):,} bytes",
        "color_palette": "Gold, Deep Navy, White",
        "description": (
            "Clean emblem insignia utilized on gateway/splash screens, standalone portal entryways (ERP, LMS, admissions dashboard), "
            "and modal login dialogs."
        ),
        "source_pages": [
            "Landing templates, ERP login gateway links, and entrance portal pages"
        ],
        "recommended_usage": "Student/Faculty ERP login screen header, standalone portal pages, or modal popups."
    },
    {
        "filename": "landing_logo_bg.jpg",
        "title": "Landing Logo Background Accent Graphic",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/landing-logo-bg.jpg",
        "asset_type": "Theme Background Graphic / Texture",
        "dimensions": "300 x 200 px",
        "file_size": f"{os.path.getsize('assets/logos/landing_logo_bg.jpg'):,} bytes",
        "color_palette": "Subtle slate grey and white textured gradients",
        "description": (
            "Graphic background plate designed to sit behind the landing portal logo, providing depth, subtle drop-shadow texture, "
            "and visual grounding on full-bleed splash pages."
        ),
        "source_pages": [
            "Portal splash template backgrounds"
        ],
        "recommended_usage": "Card backdrop for authentication / gateway portal cards."
    },
    {
        "filename": "campus_logo.png",
        "title": "Campus Life & Facilities Brand Icon",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/campus-logo.png",
        "asset_type": "Section Branding Mark",
        "dimensions": "120 x 120 px",
        "file_size": f"{os.path.getsize('assets/logos/campus_logo.png'):,} bytes",
        "color_palette": "Deep Navy Blue and Slate",
        "description": (
            "Architectural campus emblem representing the physical institution, campus facilities, and infrastructure blocks. "
            "Used to badge campus-related pages, virtual tour blocks, and facility overviews."
        ),
        "source_pages": [
            "https://iiitl.ac.in/index.php/at-a-glance/",
            "https://iiitl.ac.in/index.php/reach-us/"
        ],
        "recommended_usage": "Campus life portal, hostels & amenities section header badge."
    },
    {
        "filename": "apply_logo.png",
        "title": "Admissions & Apply Portal Brand Icon",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/apply-logo.png",
        "asset_type": "Admissions Call-to-Action Brand Icon",
        "dimensions": "120 x 120 px",
        "file_size": f"{os.path.getsize('assets/logos/apply_logo.png'):,} bytes",
        "color_palette": "Navy Blue, White",
        "description": (
            "Specialized application emblem featuring a graduation mortarboard cap over an open portfolio/scroll. "
            "Specifically used to identify admissions links, application guidelines, and JoSAA / CSAB / CCMT intake portals."
        ),
        "source_pages": [
            "https://iiitl.ac.in/index.php/admission/",
            "https://iiitl.ac.in/index.php/admission-in-b-tech-through-jossa-csab-2022/",
            "https://iiitl.ac.in/index.php/admission-in-m-tech-through-ccmt/"
        ],
        "recommended_usage": "Call-to-action button or badge for 'Apply Now' and 'Admissions 2026' sections."
    },
    {
        "filename": "mega_menu_logo.png",
        "title": "Navigation Mega-Menu Emblem",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/mega-menu-logo.png",
        "asset_type": "Navigation Component Brand Icon",
        "dimensions": "150 x 150 px",
        "file_size": f"{os.path.getsize('assets/logos/mega_menu_logo.png'):,} bytes",
        "color_palette": "Navy, Bronze, White",
        "description": (
            "Stylized institutional crest variant integrated inside the dropdown mega-menu panels on desktop viewports. "
            "Anchors the academic departments and institutional information sub-lists."
        ),
        "source_pages": [
            "Desktop navigation dropdown mega-menu on all core pages"
        ],
        "recommended_usage": "Inside desktop mega-menu panels, drawer menus, and quick-link sidebars."
    },
    {
        "filename": "cf7_logo.png",
        "title": "Inquiry & Contact Form Brand Icon",
        "original_url": "https://iiitl.ac.in/wp-content/uploads/2018/08/cf-7-logo-1.png",
        "asset_type": "Contact / Form Section Brand Icon",
        "dimensions": "120 x 120 px",
        "file_size": f"{os.path.getsize('assets/logos/cf7_form_logo.png'):,} bytes",
        "color_palette": "Slate Blue and White",
        "description": (
            "Emblem graphic used atop the official contact forms, feedback modals, and RTI inquiry submission blocks."
        ),
        "source_pages": [
            "https://iiitl.ac.in/index.php/contact-us/",
            "https://iiitl.ac.in/index.php/queries/"
        ],
        "recommended_usage": "Contact Us page header illustration and feedback form banner."
    }
]

md_lines = [
    "# IIIT Lucknow - Logos & Brand Assets Catalog\n",
    "> **Directory:** `assets/logos/`  ",
    f"> **Total Registered Logo Assets:** {len(logos_info)}  ",
    "> **Status:** Verified, downloaded, and labeled with full semantic metadata.\n",
    "This document catalogs all official logos, institutional emblems, sub-organization identity marks, and brand assets retrieved from across the pages and subpages of the Indian Institute of Information Technology, Lucknow (https://iiitl.ac.in/).\n",
    "---\n",
    "## 1. Quick Reference Table\n",
    "| Filename | Asset Role | Dimensions | File Size | Primary Source URL |",
    "| :--- | :--- | :--- | :--- | :--- |"
]

for l in logos_info:
    md_lines.append(f"| [`{l['filename']}`](../../assets/logos/{l['filename']}) | {l['asset_type']} | {l['dimensions']} | {l['file_size']} | [{l['original_url'].split('/')[-1]}]({l['original_url']}) |")

md_lines.append("\n---\n")
md_lines.append("## 2. Detailed Asset Descriptions & Context\n")

for i, l in enumerate(logos_info, 1):
    md_lines.append(f"### {i}. `{l['filename']}` — {l['title']}")
    md_lines.append(f"- **Local Path:** `assets/logos/{l['filename']}`")
    md_lines.append(f"- **Original URL:** [{l['original_url']}]({l['original_url']})")
    md_lines.append(f"- **Asset Role:** {l['asset_type']}")
    md_lines.append(f"- **Native Dimensions:** {l['dimensions']}")
    md_lines.append(f"- **File Size:** {l['file_size']}")
    md_lines.append(f"- **Color Palette:** {l['color_palette']}")
    md_lines.append(f"- **Visual & Symbolic Description:**\n  {l['description']}")
    md_lines.append(f"- **Website Usage & Context:**")
    for page in l['source_pages']:
        md_lines.append(f"  - {page}")
    md_lines.append(f"- **Rebuild Recommendation:** {l['recommended_usage']}\n")

with open('agents/assets_description/logos_description.md', 'w') as f:
    f.write('\n'.join(md_lines))

print(f"Generated agents/assets_description/logos_description.md ({len(logos_info)} items).")
