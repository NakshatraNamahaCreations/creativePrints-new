// src/templates/index.js

export const TEMPLATES = [
  {
    id: "vp_ribbon",
    name: "Vistaprint – Ribbon",
     categories: ["standard","classic"],
    palettes: [
      { id: "red",   bg: "#FFFFFF", primary: "#333333", accent: "#C52B2B", accent2: "#8F1E1E" },
      { id: "blue1", bg: "#FFFFFF", primary: "#333333", accent: "#2C6CB0", accent2: "#1D4E86" },
      { id: "blue2", bg: "#FFFFFF", primary: "#333333", accent: "#4EA3D8", accent2: "#327CA8" },
      { id: "olive", bg: "#FFFFFF", primary: "#333333", accent: "#9BC243", accent2: "#6F8E2A" },
    ],

    sides: {
      front: {
        elements: [
          // Backgrounds
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
          { type: "rect", x: "0%", y: 0, w: "10%", h: "100%", fill: "#E5E7EB" },

          // Logo
          { type: "image", bindTo: "logoUrl", x: "58%", y: "15%", w: "18%", h: "20%" },

          // Top-left text block
          { type: "text", bindTo: "fullName", x: "14%", y: "15%", fontSize: 24, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "jobTitle", x: "14%", y: "23%", fontSize: 16, fontWeight: 400, fill: "{primary}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "email",    x: "14%", y: "30%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },

          // Ribbon + accent
          { type: "rect", x: "10%", y: "42%", w: "80%", h: 40, fill: "{accent}" },
          { type: "rect", x: "10%", y: "42%", w: "80%", h: 4,  fill: "{accent2}" },
          {
            type: "polygon",
            fill: "{accent}",
            points: [
              { x: "0%",  y: "0%"  },
              { x: "30%", y: "0%"  },
              { x: "20%", y: "9%"  },
              { x: "0%",  y: "9%"  },
            ]
          },

          // Company name on/near ribbon
          { type: "text", bindTo: "companyName", x: "58%", y: "44%", fontSize: 20, fontWeight: 700, fill: "#FFFFFF", fontFamily: "Playfair Display" },

          // Address block (left bottom)
          { type: "text", bindTo: "address1",     x: "14%", y: "56%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "address2",     x: "14%", y: "62%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "cityStatePin", x: "14%", y: "68%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },

          // Contact block (right bottom)
          { type: "text", bindTo: "phone", x: "58%", y: "56%", fontSize: 16, fontWeight: 400, fill: "{primary}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "fax",   x: "58%", y: "62%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "web",   x: "58%", y: "68%", fontSize: 16, fontWeight: 400, fill: "{accent}", fontFamily: "Playfair Display" },
        ],
      },

      back: {
        elements: [
          // background full card
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // subtle brand bar bottom
          { type: "rect", x: "0%", y: "80%", w: "100%", h: "20%", fill: "{accent}" },

          // centered logo bigger
          { type: "image", bindTo: "logoUrl", x: "40%", y: "25%", w: "20%", h: "20%" },

          // company name centered
          { type: "text", bindTo: "companyName", x: "20%", y: "52%", fontSize: 28, fontWeight: 700, fill: "{primary}", fontFamily: "Playfair Display" },

          // website below
          { type: "text", bindTo: "web", x: "20%", y: "62%", fontSize: 18, fontWeight: 500, fill: "{accent2}", fontFamily: "Playfair Display" },

          // optional tagline static
         
        ],
      },
    },
  },

  {
    id: "vp_top_banner",
    name: "Top Banner", 
    categories: ["classic","standard"],
    palettes: [
      { id: "olive",   bg: "#FFFFFF", primary: "#333333", accent: "#9BC243", accent2: "#6F8E2A" },
      { id: "ocean",   bg: "#FFFFFF", primary: "#1F2937", accent: "#2563EB", accent2: "#1E40AF" },
      { id: "red",     bg: "#FFFFFF", primary: "#333333", accent: "#C52B2B", accent2: "#8F1E1E" },
      { id: "blue1",   bg: "#FFFFFF", primary: "#333333", accent: "#2C6CB0", accent2: "#1D4E86" },
      { id: "blue2",   bg: "#FFFFFF", primary: "#333333", accent: "#4EA3D8", accent2: "#327CA8" },
    ],

    sides: {
      front: {
        elements: [
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // Top banner strip
          { type: "rect", x: 0, y: 0, w: "100%", h: "22%", fill: "{accent}" },
          { type: "rect", x: 0, y: "22%", w: "100%", h: 4, fill: "{accent2}" },

          // logo in banner
          { type: "image", bindTo: "logoUrl", x: "6%", y: "4%", w: "18%", h: "16%"},

          // companyName on banner right
          { type: "text", bindTo: "companyName", x: "32%", y: "10%", fontSize: 28, fontWeight: 800, fill: "#FFFFFF" },

          // identity under banner
          { type: "text", bindTo: "fullName", x: "8%", y: "30%", fontSize: 28, fontWeight: 700, fill: "{primary}" },
          { type: "text", bindTo: "jobTitle", x: "8%", y: "39%", fontSize: 20, fontWeight: 500, fill: "#333" },

          // contact / info columns
          { type: "text", bindTo: "email",        x: "8%",  y: "52%", fontSize: 16, fill: "#333" },
          { type: "text", bindTo: "phone",        x: "8%",  y: "58%", fontSize: 16, fill: "{primary}" },
          { type: "text", bindTo: "fax",          x: "8%",  y: "64%", fontSize: 16, fill: "#333" },
          { type: "text", bindTo: "web",          x: "8%",  y: "70%", fontSize: 16, fill: "{accent}" },

          { type: "text", bindTo: "address1",     x: "56%", y: "52%", fontSize: 18, fill: "#333" },
          { type: "text", bindTo: "address2",     x: "56%", y: "58%", fontSize: 18, fill: "#333" },
          { type: "text", bindTo: "cityStatePin", x: "56%", y: "64%", fontSize: 18, fill: "#333" },
        ],
      },

      back: {
        elements: [
          // clean back with accent header strip
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
          { type: "rect", x: 0, y: "78%", w: "100%", h: "22%", fill: "{accent}" },

          // centered logo
          { type: "image", bindTo: "logoUrl", x: "41%", y: "20%", w: "18%", h: "18%" },

          // company large
          { type: "text", bindTo: "companyName", x: "20%", y: "45%", fontSize: 30, fontWeight: 700, fill: "{primary}" },

          // website below
          { type: "text", bindTo: "web", x: "20%", y: "57%", fontSize: 18, fontWeight: 600, fill: "{accent2}" },

          // tagline static
          { type: "text", text: "We build trust.", x: "20%", y: "66%", fontSize: 14, fontWeight: 400, fill: "{primary}" },
        ],
      },
    },
  },

  {
    id: "vp_bottom_wave",
    name: "Bottom Wave",
     categories: [ "classic","standard"],
    palettes: [
      { id: "royal",   bg: "#FFFFFF", primary: "#222222", accent: "#004AAD", accent2: "#002E73" },
      { id: "emerald", bg: "#FFFFFF", primary: "#1B4332", accent: "#40916C", accent2: "#2D6A4F" },
      { id: "ruby",    bg: "#FFFFFF", primary: "#2B1D1D", accent: "#D00000", accent2: "#9D0208" },
      { id: "sunset",  bg: "#FFFFFF", primary: "#2D1B00", accent: "#E85D04", accent2: "#BB3E03" },
    ],

    sides: {
      front: {
        elements: [
          // Background
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // Angled polygon wave bottom-right style
          {
            type: "polygon",
            fill: "{accent}",
            points: [
              { x: "10%",  y: "100%" },
              { x: "150%", y: "5%"   },
              { x: "150%", y: "100%" },
            ]
          },

          // Logo (top-right)
          { type: "image", bindTo: "logoUrl", x: "60%", y: "15%", w: "17%", h: "18%" },

          // Name + Job Title
          { type: "text", bindTo: "fullName", x: "8%", y: "16%", fontSize: 32, fontWeight: 800, fill: "{primary}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "jobTitle", x: "8%", y: "28%", fontSize: 28, fontWeight: 500, fill: "#4B5563", fontFamily: "Poppins" },

          // Company name mid card
          { type: "text", bindTo: "companyName", x: "8%", y: "40%", fontSize: 26, fontWeight: 700, fill: "{accent}", fontFamily: "Montserrat" },

          // Contact details left column
          { type: "text", bindTo: "email", x: "8%", y: "53%", fontSize: 18, fontWeight: 400, fill: "#333", fontFamily: "Open Sans" },
          { type: "text", bindTo: "phone", x: "8%", y: "60%", fontSize: 18, fontWeight: 400, fill: "#333", fontFamily: "Open Sans" },
          { type: "text", bindTo: "fax",   x: "8%", y: "66%", fontSize: 18, fontWeight: 400, fill: "#333", fontFamily: "Open Sans" },

          // Address block on right side
          { type: "text", bindTo: "address1",     x: "60%", y: "58%", fontSize: 20, fontWeight: 400, fill: "#fff", fontFamily: "Roboto" },
          { type: "text", bindTo: "address2",     x: "60%", y: "65%", fontSize: 20, fontWeight: 400, fill: "#fff", fontFamily: "Roboto" },

          // Website above wave (in white)
          { type: "text", bindTo: "web", x: "35%", y: "84%", fontSize: 17, fontWeight: 600, fill: "#FFFFFF", fontFamily: "Poppins" },
        ],
      },

      back: {
        elements: [
          // Simple dark accent footer style to match "wave"
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
          {
            type: "polygon",
            fill: "{accent}",
            points: [
              { x: "0%",   y: "70%" },
              { x: "100%", y: "50%" },
              { x: "100%", y: "100%" },
              { x: "0%",   y: "100%" },
            ]
          },

          // centered logo
          { type: "image", bindTo: "logoUrl", x: "40%", y: "20%", w: "20%", h: "20%" },

          // company bold mid
          { type: "text", bindTo: "companyName", x: "20%", y: "45%", fontSize: 28, fontWeight: 700, fill: "{primary}" },

          // website mid/low
          { type: "text", bindTo: "web", x: "20%", y: "55%", fontSize: 18, fontWeight: 500, fill: "{accent2}" },

          // tagline
          { type: "text", text: "Quality. Reliability. Service.", x: "20%", y: "63%", fontSize: 14, fontWeight: 400, fill: "{primary}" },
        ],
      },
    },
  },

  {
    id: "vp_screenshot_match",
    name: "Screenshot Match",
         categories: [ "square"],
    palettes: [
      { id: "navy",     bg: "#FFFFFF", primary: "#2A2A2A", accent: "#0B3A82", accent2: "#0B3A82", cream: "#F2EBC7" },
      { id: "teal",     bg: "#FFFFFF", primary: "#2A2A2A", accent: "#0C6D6D", accent2: "#0C6D6D", cream: "#F2EBC7" },
      { id: "charcoal", bg: "#FFFFFF", primary: "#2A2A2A", accent: "#333333", accent2: "#333333", cream: "#EFE7C8" },
    ],

    sides: {
      front: {
        elements: [
          // Base background
          { type: "rect", x: 0, y: 0, w: "0%", h: "100%", fill: "{bg}" },

          // LEFT IMAGE (logo square)
          { type: "image", bindTo: "logoUrl", x: "9%", y: "14%", w: "26%", h: "26%" },

          // TITLE ("companyName") to right
          { type: "text", bindTo: "companyName", x: "41%", y: "18%",
            fontSize: 22, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // SUBTITLE ("companyMessage")
          { type: "text", bindTo: "companyMessage", x: "42%", y: "27%",
            fontSize: 17, fontWeight: 400, fill: "{primary}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // THIN BLUE RULE
          { type: "rect", x: "0%", y: "53%", w: "100%", h: 4, fill: "{accent2}" },

          // BEIGE FOOTER BAND
          { type: "rect", x: 0, y: "54%", w: "100%", h: "35%", fill: "{cream}" },

          // LEFT NAME (accent color)
          { type: "text", bindTo: "fullName", x: "9%", y: "58%",
            fontSize: 22, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // CONTACT LEFT SIDE
          { type: "text", bindTo: "phone", x: "9%", y: "67%",
            fontSize: 16, fontWeight: 400, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },
          { type: "text", bindTo: "email", x: "9%", y: "72%",
            fontSize: 16, fontWeight: 400, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },


        ],
      },

      back: {
        elements: [
          // back side: mostly brand block
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // cream footer band to mimic front style
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{cream}" },

          // company mark centered upper
          { type: "image", bindTo: "logoUrl", x: "27%", y: "19%", w: "30%", h: "30%" },

          // companyName center
          { type: "text", bindTo: "companyName", x: "20%", y: "50%",
            fontSize: 30, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // website center
          { type: "text", bindTo: "web", x: "36%", y: "60%",
            fontSize: 16, fontWeight: 500, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },

       
        ],
      },
    },
  },
  {
  id: "vp_square_modern_grid",
  name: "Square — Modern Grid",
  categories: [ "square", "grid" ],
  palettes: [
    { id: "green",    bg: "#FFFFFF", primary: "#2A2A2A", accent: "#067C4F", accent2: "#0B8A5A", cream: "#F7F7F2" },
    { id: "olive",    bg: "#FFFFFF", primary: "#2A2A2A", accent: "#3A6B2A", accent2: "#2E5A1F", cream: "#F6F2E6" },
    { id: "stone",    bg: "#FFFFFF", primary: "#2A2A2A", accent: "#444444", accent2: "#6B6B6B", cream: "#EFE9DE" },
  ],

  sides: {
    front: {
      elements: [
        // background
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // top-left: square logo tile (grid cell 1)
        { type: "rect", x: "6%", y: "6%", w: "28%", h: "28%", fill: "{cream}", rx: 8, ry: 8 },
        { type: "image", bindTo: "logoUrl", x: "9%", y: "9%", w: "22%", h: "22%", fit: "cover" },

        // top-right: title block (grid cell 2 spanning right)
        { type: "text", bindTo: "companyName", x: "40%", y: "10%", fontSize: 22, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display, Georgia, serif", w: "52%", align: "left" },
        { type: "text", bindTo: "companyMessage", x: "42%", y: "18%", fontSize: 13, fontWeight: 400, fill: "{primary}", fontFamily: "Inter, system-ui, Arial", w: "52%", align: "left" },

        // middle: thin divider line across
        { type: "rect", x: "5%", y: "52%", w: "70%", h: 2, fill: "{accent2}" },

        // three info cards (bottom left / center / right) — grid feel
        // { type: "rect", x: "6%", y: "46%", w: "28%", h: "34%", fill: "transparent" },
        { type: "text", bindTo: "fullName", x: "9%", y: "63%", fontSize: 18, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display, Georgia, serif" },
        { type: "text", bindTo: "title", x: "9%", y: "57%", fontSize: 14, fontWeight: 500, fill: "{primary}", fontFamily: "Inter, system-ui, Arial" },

        { type: "rect", x: "36%", y: "46%", w: "28%", h: "34%", fill: "transparent" },
        { type: "text", bindTo: "phone", x: "53%", y: "63%", fontSize: 16, fontWeight: 600, fill: "{primary}", fontFamily: "Inter, system-ui, Arial" },
        { type: "text", bindTo: "email", x: "9%", y: "70%", fontSize: 14, fontWeight: 400, fill: "{primary}", fontFamily: "Inter, system-ui, Arial" },

        { type: "rect", x: "66%", y: "46%", w: "28%", h: "34%", fill: "transparent" },
        { type: "text", bindTo: "web", x: "56%", y: "70%", fontSize: 14, fontWeight: 600, fill: "{primary}", fontFamily: "Inter, system-ui, Arial" },
        { type: "text", bindTo: "address", x: "69%", y: "57%", fontSize: 12, fontWeight: 400, fill: "{primary}", fontFamily: "Inter, system-ui, Arial", w: "26%", align: "left" },

        // subtle badge bottom-center (optional short line / year)
        { type: "rect", x: "40%", y: "82%", w: "20%", h: 28, fill: "{accent}", rx: 18, ry: 18 },
        { type: "text", bindTo: "anniv", x: "50%", y: "86%", fontSize: 12, fontWeight: 700, fill: "#fff", fontFamily: "Inter, system-ui, Arial", align: "center", anchor: "middle" }
      ],
    },

    back: {
      elements: [
        // full cream background band to echo front styling
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{cream}" },

        // small top band for title
        { type: "rect", x: "6%", y: "6%", w: "88%", h: "18%", fill: "{bg}", rx: 8, ry: 8 },
        { type: "text", bindTo: "companyName", x: "12%", y: "10%", fontSize: 20, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display, Georgia, serif" },

        // 2x2 product/photo grid centered
        // cell 1
        { type: "image", bindTo: "photo1", x: "10%", y: "30%", w: "38%", h: "30%", fit: "cover", rx: 6, ry: 6 },
        // cell 2
        { type: "image", bindTo: "photo2", x: "52%", y: "30%", w: "38%", h: "30%", fit: "cover", rx: 6, ry: 6 },
        // cell 3
        { type: "image", bindTo: "photo3", x: "10%", y: "64%", w: "38%", h: "30%", fit: "cover", rx: 6, ry: 6 },
        // cell 4
        { type: "image", bindTo: "photo4", x: "52%", y: "64%", w: "38%", h: "30%", fit: "cover", rx: 6, ry: 6 },

        // centered small logo overlaid top-right of grid (badge)
        { type: "image", bindTo: "logoUrl", x: "74%", y: "22%", w: "14%", h: "14%", fit: "contain" },

        // footer contact line
        { type: "text", bindTo: "web", x: "50%", y: "96%", fontSize: 12, fontWeight: 600, fill: "{primary}", fontFamily: "Inter, system-ui, Arial", align: "center", anchor: "middle" }
      ],
    },
  },
},

{
  id: "vp_standard_nnc",
  name: "Standard — NNC Style (Ribbon Footer)",
  categories: ["standard","classic"],
  palettes: [
    { id: "nnc_navy", bg: "#FFFFFF", primary: "#FFC61A", accent: "#0E3B53", accent2: "#0B2C3B", cream: "#F2EBC7" },
    { id: "nnc_teal", bg: "#FFFFFF", primary: "#0CC9B6", accent: "#064B4A", accent2: "#033937", cream: "#F2EBC7" },
    { id: "nnc_charcoal", bg: "#FFFFFF", primary: "#FFD24D", accent: "#1E2A36", accent2: "#0F1A22", cream: "#F2EBC7" },
  ],

  sides: {
    front: {
      elements: [
        // full background
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // top white visual area (padding / spacing)
        { type: "rect", x: 0, y: 0, w: "100%", h: "60%", fill: "{bg}" },

        // centered small square logo above text
        // originX/originY supported by your renderer
        { type: "image", bindTo: "logoUrl", x: "38%", y: "6%", w: "16%", h: "22%", originX: "center", originY: "top",  props: { objectFit: "contain" } },

        // Company name (big initials / brand) centered under logo
        { type: "text", bindTo: "companyName", x: "27%", y: "29%", fontSize: 35, fontWeight: 800, fill: "{primary}", fontFamily: "Montserrat, Inter, Arial", align: "center", originX: "center" },

       
        { type: "text", bindTo: "companyMessage", x: "32%", y: "38%", fontSize: 22, fontWeight: 600, fill: "{accent2}", fontFamily: "Inter, Arial", align: "center", originX: "center" },

        // thin divider / accent line between white area and footer (matches preview)
        // { type: "rect", x: 0, y: "58%", w: "100%", h: 2, fill: "{accent}" },

        // footer band (accent color)
        { type: "rect", x: 0, y: "50%", w: "100%", h: "40%", fill: "{accent}" },

        // subtle diagonal glossy overlay on footer (decor) — polygon approximating gloss


        // LEFT column inside footer (accent name + job + phone)
        { type: "text", bindTo: "companyName", x: "6%", y: "56%", fontSize: 18, fontWeight: 800, fill: "{primary}", fontFamily: "Montserrat, Inter" },
        { type: "text", bindTo: "jobTitle",    x: "6%", y: "62%", fontSize: 18, fontWeight: 600, fill: "#E6EEF3", fontFamily: "Inter" },
        { type: "text", bindTo: "phone",       x: "6%", y: "68%", fontSize: 18, fontWeight: 700, fill: "#E6EEF3", fontFamily: "Inter" },

        // RIGHT column inside footer (address lines and web)
        { type: "text", bindTo: "address1", x: "52%", y: "56%", fontSize: 18, fontWeight: 700, fill: "#E6EEF3", fontFamily: "Inter" },
        { type: "text", bindTo: "address2", x: "52%", y: "62%", fontSize: 18, fontWeight: 500, fill: "#E6EEF3", fontFamily: "Inter" },
        { type: "text", bindTo: "web",      x: "52%", y: "68%", fontSize: 18, fontWeight: 600, fill: "{primary}", fontFamily: "Inter" },

      
      ],
    },

    back: {
      elements: [
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // large centered logo on back
        { type: "image", bindTo: "logoUrl", x: "30%", y: "14%", w: "30%", h: "30%", originX: "center", originY: "top", props: { objectFit: "contain" } },

        // company name large centered (accent color)
      { type: "text", bindTo: "companyName", x: "30%", y: "49%", fontSize: 26, fontWeight: 800, fill: "{accent}", fontFamily: "Montserrat, Playfair Display", align: "center", originX: "center" },

        // small footer stripe
        { type: "rect", x: 0, y: "78%", w: "100%", h: "22%", fill: "{accent}" },

        // website on footer
        { type: "text", bindTo: "web", x: "50%", y: "86%", fontSize: 12, fontWeight: 600, fill: "#FFFFFF", fontFamily: "Inter", align: "center", originX: "center" },
      ],
    },
  },
},
{
    id: "vp_ribbon2",
    name: "Vistaprint – Ribbon2",
     categories: ["rounded-corner"],
    palettes: [
      { id: "red",   bg: "#FFFFFF", primary: "#333333", accent: "#C52B2B", accent2: "#8F1E1E" },
      { id: "blue1", bg: "#FFFFFF", primary: "#333333", accent: "#2C6CB0", accent2: "#1D4E86" },
      { id: "blue2", bg: "#FFFFFF", primary: "#333333", accent: "#4EA3D8", accent2: "#327CA8" },
      { id: "olive", bg: "#FFFFFF", primary: "#333333", accent: "#9BC243", accent2: "#6F8E2A" },
    ],

    sides: {
      front: {
        elements: [
          // Backgrounds
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
          { type: "rect", x: "0%", y: 0, w: "10%", h: "100%", fill: "#E5E7EB" },

          // Logo
          { type: "image", bindTo: "logoUrl", x: "58%", y: "15%", w: "18%", h: "20%" },

          // Top-left text block
          { type: "text", bindTo: "fullName", x: "14%", y: "15%", fontSize: 24, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "jobTitle", x: "14%", y: "23%", fontSize: 16, fontWeight: 400, fill: "{primary}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "email",    x: "14%", y: "30%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },

          // Ribbon + accent
          { type: "rect", x: "10%", y: "42%", w: "80%", h: 40, fill: "{accent}" },
          { type: "rect", x: "10%", y: "42%", w: "80%", h: 4,  fill: "{accent2}" },
          {
            type: "polygon",
            fill: "{accent}",
            points: [
              { x: "0%",  y: "0%"  },
              { x: "30%", y: "0%"  },
              { x: "20%", y: "9%"  },
              { x: "0%",  y: "9%"  },
            ]
          },

          // Company name on/near ribbon
          { type: "text", bindTo: "companyName", x: "58%", y: "44%", fontSize: 20, fontWeight: 700, fill: "#FFFFFF", fontFamily: "Playfair Display" },

          // Address block (left bottom)
          { type: "text", bindTo: "address1",     x: "14%", y: "56%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "address2",     x: "14%", y: "62%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "cityStatePin", x: "14%", y: "68%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },

          // Contact block (right bottom)
          { type: "text", bindTo: "phone", x: "58%", y: "56%", fontSize: 16, fontWeight: 400, fill: "{primary}", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "fax",   x: "58%", y: "62%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
          { type: "text", bindTo: "web",   x: "58%", y: "68%", fontSize: 16, fontWeight: 400, fill: "{accent}", fontFamily: "Playfair Display" },
        ],
      },

      back: {
        elements: [
          // background full card
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // subtle brand bar bottom
          { type: "rect", x: "0%", y: "80%", w: "100%", h: "20%", fill: "{accent}" },

          // centered logo bigger
          { type: "image", bindTo: "logoUrl", x: "40%", y: "25%", w: "20%", h: "20%" },

          // company name centered
          { type: "text", bindTo: "companyName", x: "20%", y: "52%", fontSize: 28, fontWeight: 700, fill: "{primary}", fontFamily: "Playfair Display" },

          // website below
          { type: "text", bindTo: "web", x: "20%", y: "62%", fontSize: 18, fontWeight: 500, fill: "{accent2}", fontFamily: "Playfair Display" },

          // optional tagline static
         
        ],
      },
    },
  },

{
  id: "vp_standard_nnc2",
  name: "Standard — NNC Style (Ribbon Footer)",
  categories: ["rounded-corner"],
  palettes: [
    { id: "nnc_navy", bg: "#FFFFFF", primary: "#FFC61A", accent: "#0E3B53", accent2: "#0B2C3B", cream: "#F2EBC7" },
    { id: "nnc_teal", bg: "#FFFFFF", primary: "#0CC9B6", accent: "#064B4A", accent2: "#033937", cream: "#F2EBC7" },
    { id: "nnc_charcoal", bg: "#FFFFFF", primary: "#FFD24D", accent: "#1E2A36", accent2: "#0F1A22", cream: "#F2EBC7" },
  ],

  sides: {
    front: {
      elements: [
        // full background
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // top white visual area (padding / spacing)
        { type: "rect", x: 0, y: 0, w: "100%", h: "60%", fill: "{bg}" },

        // centered small square logo above text
        // originX/originY supported by your renderer
        { type: "image", bindTo: "logoUrl", x: "38%", y: "6%", w: "16%", h: "22%", originX: "center", originY: "top",  props: { objectFit: "contain" } },

        // Company name (big initials / brand) centered under logo
        { type: "text", bindTo: "companyName", x: "27%", y: "29%", fontSize: 35, fontWeight: 800, fill: "{primary}", fontFamily: "Montserrat, Inter, Arial", align: "center", originX: "center" },

       
        { type: "text", bindTo: "companyMessage", x: "32%", y: "38%", fontSize: 22, fontWeight: 600, fill: "{accent2}", fontFamily: "Inter, Arial", align: "center", originX: "center" },

        // thin divider / accent line between white area and footer (matches preview)
        // { type: "rect", x: 0, y: "58%", w: "100%", h: 2, fill: "{accent}" },

        // footer band (accent color)
        { type: "rect", x: 0, y: "50%", w: "100%", h: "40%", fill: "{accent}" },

        // subtle diagonal glossy overlay on footer (decor) — polygon approximating gloss


        // LEFT column inside footer (accent name + job + phone)
        { type: "text", bindTo: "companyName", x: "6%", y: "56%", fontSize: 18, fontWeight: 800, fill: "{primary}", fontFamily: "Montserrat, Inter" },
        { type: "text", bindTo: "jobTitle",    x: "6%", y: "62%", fontSize: 18, fontWeight: 600, fill: "#E6EEF3", fontFamily: "Inter" },
        { type: "text", bindTo: "phone",       x: "6%", y: "68%", fontSize: 18, fontWeight: 700, fill: "#E6EEF3", fontFamily: "Inter" },

        // RIGHT column inside footer (address lines and web)
        { type: "text", bindTo: "address1", x: "52%", y: "56%", fontSize: 18, fontWeight: 700, fill: "#E6EEF3", fontFamily: "Inter" },
        { type: "text", bindTo: "address2", x: "52%", y: "62%", fontSize: 18, fontWeight: 500, fill: "#E6EEF3", fontFamily: "Inter" },
        { type: "text", bindTo: "web",      x: "52%", y: "68%", fontSize: 18, fontWeight: 600, fill: "{primary}", fontFamily: "Inter" },

      
      ],
    },

    back: {
      elements: [
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // large centered logo on back
        { type: "image", bindTo: "logoUrl", x: "30%", y: "14%", w: "30%", h: "30%", originX: "center", originY: "top", props: { objectFit: "contain" } },

        // company name large centered (accent color)
      { type: "text", bindTo: "companyName", x: "30%", y: "49%", fontSize: 26, fontWeight: 800, fill: "{accent}", fontFamily: "Montserrat, Playfair Display", align: "center", originX: "center" },

        // small footer stripe
        { type: "rect", x: 0, y: "78%", w: "100%", h: "22%", fill: "{accent}" },

        // website on footer
        { type: "text", bindTo: "web", x: "50%", y: "86%", fontSize: 12, fontWeight: 600, fill: "#FFFFFF", fontFamily: "Inter", align: "center", originX: "center" },
      ],
    },
  },
},

 {
  id: "vp_square_modern_grid2",
  name: "Circular card",
  categories: [ "circle-visiting-cards"],
  palettes: [
    { id: "green",    bg: "#FFFFFF", primary: "#2A2A2A", accent: "#067C4F", accent2: "#0B8A5A", cream: "#F7F7F2" },
    { id: "olive",    bg: "#FFFFFF", primary: "#2A2A2A", accent: "#3A6B2A", accent2: "#2E5A1F", cream: "#F6F2E6" },
    { id: "stone",    bg: "#FFFFFF", primary: "#2A2A2A", accent: "#444444", accent2: "#6B6B6B", cream: "#EFE9DE" },
  ],

  sides: {
    front: {
      elements: [
        // background
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // top-left: square logo tile (grid cell 1)
        { type: "rect", x: "26%", y: "6%", w: "28%", h: "28%", fill: "{cream}", rx: 8, ry: 8 },
        { type: "image", bindTo: "logoUrl", x: "29%", y: "9%", w: "22%", h: "22%", fit: "cover" },

        // top-right: title block (grid cell 2 spanning right)
        { type: "text", bindTo: "companyName", x: "25%", y: "38%", fontSize: 22, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display, Georgia, serif", w: "52%", align: "left" },
        { type: "text", bindTo: "companyMessage", x: "31%", y: "43%", fontSize: 13, fontWeight: 400, fill: "{primary}", fontFamily: "Inter, system-ui, Arial", w: "52%", align: "left" },

        // middle: thin divider line across
        { type: "rect", x: "5%", y: "52%", w: "70%", h: 2, fill: "{accent2}" },

        // three info cards (bottom left / center / right) — grid feel
        // { type: "rect", x: "6%", y: "46%", w: "28%", h: "34%", fill: "transparent" },
        { type: "text", bindTo: "fullName", x: "32%", y: "63%", fontSize: 18, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display, Georgia, serif" },
    
        // { type: "text", bindTo: "phone", x: "53%", y: "63%", fontSize: 16, fontWeight: 600, fill: "{primary}", fontFamily: "Inter, system-ui, Arial" },
        { type: "text", bindTo: "email", x: "33%", y: "70%", fontSize: 14, fontWeight: 400, fill: "{primary}", fontFamily: "Inter, system-ui, Arial" },

            ],
    },

    back: {
      elements: [
        // full cream background band to echo front styling
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{cream}" },

        // small top band for title
        { type: "text", bindTo: "companyName", x: "27%", y: "20%", fontSize: 20, fontWeight: 700, fill: "{accent}", fontFamily: "Playfair Display, Georgia, serif" },

    

        // centered small logo overlaid top-right of grid (badge)
        { type: "image", bindTo: "logoUrl", x: "18%", y: "28%", w: "44%", h: "44%", fit: "contain" },

        // footer contact line
        { type: "text", bindTo: "web", x: "50%", y: "96%", fontSize: 12, fontWeight: 600, fill: "{primary}", fontFamily: "Inter, system-ui, Arial", align: "center", anchor: "middle" }
      ],
    },
  },
},


  {
    id: "vp_screenshot_match1",
    name: "Circular card 2",
         categories: [ "circle-visiting-cards"],
    palettes: [
      { id: "navy",     bg: "#FFFFFF", primary: "#2A2A2A", accent: "#0B3A82", accent2: "#0B3A82", cream: "#F2EBC7" },
      { id: "teal",     bg: "#FFFFFF", primary: "#2A2A2A", accent: "#0C6D6D", accent2: "#0C6D6D", cream: "#F2EBC7" },
      { id: "charcoal", bg: "#FFFFFF", primary: "#2A2A2A", accent: "#333333", accent2: "#333333", cream: "#EFE7C8" },
    ],

    sides: {
      front: {
        elements: [
          // Base background
          { type: "rect", x: 0, y: 0, w: "0%", h: "100%", fill: "{bg}" },

          // LEFT IMAGE (logo square)
          { type: "image", bindTo: "logoUrl", x: "24%", y: "8%", w: "32%", h: "32%" },

          // TITLE ("companyName") to right
          { type: "text", bindTo: "companyName", x: "25%", y: "38%",
            fontSize: 22, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // SUBTITLE ("companyMessage")
          { type: "text", bindTo: "companyMessage", x: "28%", y: "46%",
            fontSize: 17, fontWeight: 400, fill: "{primary}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // THIN BLUE RULE
          { type: "rect", x: "0%", y: "53%", w: "100%", h: 4, fill: "{accent2}" },

          // BEIGE FOOTER BAND
          { type: "rect", x: 0, y: "54%", w: "100%", h: "35%", fill: "{cream}" },

          // LEFT NAME (accent color)
          { type: "text", bindTo: "fullName", x: "30%", y: "62%",
            fontSize: 22, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // CONTACT LEFT SIDE
          { type: "text", bindTo: "phone", x: "32%", y: "70%",
            fontSize: 16, fontWeight: 400, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },



        ],
      },

      back: {
        elements: [
          // back side: mostly brand block
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // cream footer band to mimic front style
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{cream}" },

          // company mark centered upper
          { type: "image", bindTo: "logoUrl", x: "27%", y: "19%", w: "30%", h: "30%" },

          // companyName center
          { type: "text", bindTo: "companyName", x: "20%", y: "50%",
            fontSize: 30, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // website center
          { type: "text", bindTo: "web", x: "34%", y: "60%",
            fontSize: 16, fontWeight: 500, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },

       
        ],
      },
    },
  },


  {
    id: "vp_screenshot_match2",
    name: "Circular card 2",
         categories: [ "oval-visiting-cards"],
    palettes: [
      { id: "navy",     bg: "#FFFFFF", primary: "#2A2A2A", accent: "#0B3A82", accent2: "#0B3A82", cream: "#F2EBC7" },
      { id: "teal",     bg: "#FFFFFF", primary: "#2A2A2A", accent: "#0C6D6D", accent2: "#0C6D6D", cream: "#F2EBC7" },
      { id: "charcoal", bg: "#FFFFFF", primary: "#2A2A2A", accent: "#333333", accent2: "#333333", cream: "#EFE7C8" },
    ],

    sides: {
      front: {
        elements: [
          // Base background
          { type: "rect", x: 0, y: 0, w: "0%", h: "100%", fill: "{bg}" },

          // LEFT IMAGE (logo square)
          { type: "image", bindTo: "logoUrl", x: "24%", y: "8%", w: "32%", h: "32%" },

          // TITLE ("companyName") to right
          { type: "text", bindTo: "companyName", x: "25%", y: "38%",
            fontSize: 22, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // SUBTITLE ("companyMessage")
          { type: "text", bindTo: "companyMessage", x: "28%", y: "46%",
            fontSize: 17, fontWeight: 400, fill: "{primary}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // THIN BLUE RULE
          { type: "rect", x: "0%", y: "53%", w: "100%", h: 4, fill: "{accent2}" },

          // BEIGE FOOTER BAND
          { type: "rect", x: 0, y: "54%", w: "100%", h: "35%", fill: "{cream}" },

          // LEFT NAME (accent color)
          { type: "text", bindTo: "fullName", x: "30%", y: "62%",
            fontSize: 22, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // CONTACT LEFT SIDE
          { type: "text", bindTo: "phone", x: "32%", y: "70%",
            fontSize: 16, fontWeight: 400, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },
          // { type: "text", bindTo: "email", x: "9%", y: "72%",
          //   fontSize: 16, fontWeight: 400, fill: "{primary}",
          //   fontFamily: "Inter, system-ui, Arial"
          // },


        ],
      },

      back: {
        elements: [
          // back side: mostly brand block
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

          // cream footer band to mimic front style
          { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{cream}" },

          // company mark centered upper
          { type: "image", bindTo: "logoUrl", x: "27%", y: "19%", w: "30%", h: "30%" },

          // companyName center
          { type: "text", bindTo: "companyName", x: "20%", y: "50%",
            fontSize: 30, fontWeight: 700, fill: "{accent}",
            fontFamily: "Playfair Display, Georgia, serif"
          },

          // website center
          { type: "text", bindTo: "web", x: "34%", y: "60%",
            fontSize: 16, fontWeight: 500, fill: "{primary}",
            fontFamily: "Inter, system-ui, Arial"
          },

       
        ],
      },
    },
  },
  
{
  id: "premium-letterhead",
  name: "Premium Letterhead",
  categories: ["letterhead"],
  // optional print spec – A4-ish
  spec: {
    widthMM: 210,
    heightMM: 297,
  },
  palettes: [
    {
      id: "blue_header",
      bg: "#FFFFFF",
      primary: "#0B3A82",
      accent: "#2563EB",   // header band
      accent2: "#E5E7EB",  // light grey/footer
    },
  ],

  sides: {
    front: {
      elements: [
        // full white background
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // solid accent (your renderer doesn't do gradients, so we approximate)
        { type: "rect", x: 0, y: 0, w: "100%", h: "14%", fill: "{accent}" },

        // Company name (top-left, white)
        {
          type: "text",
          bindTo: "companyName",
          x: "6%",
          y: "3%",
          fontSize: 28,
          fontWeight: 700,
          fill: "#FFFFFF",
          fontFamily: "Inter, system-ui, Arial",
        },

        // Tagline / subtitle
        {
          type: "text",
          bindTo: "companyMessage",
          x: "7%",
          y: "8%",
          fontSize: 14,
          fontWeight: 600,
          fill: "#E5E7EB",
          fontFamily: "Inter, system-ui, Arial",
        },

        // Logo box on right (light rounded square)
        {
          type: "rect",
          x: "65%",
          y: "2%",
          w: "15%",
          h: "10%",
          fill: "#F3F4F6",
          rx: 6,
          ry: 6,
        },
        {
          type: "image",
          bindTo: "logoUrl",
           x: "65%",
          y: "2%",
           w: "17%",
          h: "10%",
          rx: 6,
          ry: 6,
        },

        {
          type: "rect",
          x: 0,
          y: "78%",
          w: "100%",
          h: "18%",
          fill: "{accent2}",
        },

        {
          type: "text",
          bindTo: "address1",
          x: "8%",
          y: "83%",
          fontSize: 14,
          fontWeight: 400,
          fill: "#4B5563",
          fontFamily: "Inter, system-ui, Arial",
        },
        // {
        //   type: "text",
        //   bindTo: "address2",
        //   x: "8%",
        //   y: "91%",
        //   fontSize: 14,
        //   fontWeight: 400,
        //   fill: "#4B5563",
        //   fontFamily: "Inter, system-ui, Arial",
        // },

        {
          type: "text",
          bindTo: "phone",
          x: "68%",
          y: "83%",
          fontSize: 14,
          fontWeight: 500,
          fill: "#4B5563",
          fontFamily: "Inter, system-ui, Arial",
        },
        // {
        //   type: "text",
        //   bindTo: "email",
        //   x: "68%",
        //   y: "91%",
        //   fontSize: 11,
        //   fontWeight: 400,
        //   fill: "#4B5563",
        //   fontFamily: "Inter, system-ui, Arial",
        // },
        // {
        //   type: "text",
        //   bindTo: "web",
        //   x: "38%",
        //   y: "85%",
        //   fontSize: 14,
        //   fontWeight: 500,
        //   fill: "{primary}",
        //   fontFamily: "Inter, system-ui, Arial",
        // },
      ],
    },

    // back side – keep blank for now
    back: {
      elements: [
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
      ],
    },
  },
},

{
  id: "sideband-letterhead",
  name: "Side Band Letterhead",
  categories: ["letterhead"],

  spec: {
    widthMM: 210,
    heightMM: 297,
  },

  palettes: [
    {
      id: "teal_side",
      bg: "#FFFFFF",
      primary: "#065F46",  // dark teal
      accent: "#14B8A6",   // teal band
      accent2: "#ECFDF5",  // soft green footer
    },
  ],

  sides: {
    front: {
      elements: [
        // Background
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

        // LEFT SIDE BAND
        {
          type: "rect",
          x: 0,
          y: 0,
          w: "10%",      
          h: "100%",
          fill: "{accent}",
        },

        // Small darker strip inside band (adds depth)
        // {
        //   type: "rect",
        //   x: "2%",
        //   y: "8%",
        //   w: "4%",
        //   h: "30%",
        //   fill: "{primary}",
        //   rx: 4,
        //   ry: 4,
        // },

        // Company name (top right)
        {
          type: "text",
          bindTo: "companyName",
          x: "13%",
          y: "3%",
          fontSize: 28,
          fontWeight: 700,
          fill: "{primary}",
          fontFamily: "Inter, system-ui, Arial",
        },

        // Tagline / subtitle
        {
          type: "text",
          bindTo: "companyMessage",
          x: "14%",
          y: "9%",
          fontSize: 14,
          fontWeight: 500,
          fill: "#6B7280",
          fontFamily: "Inter, system-ui, Arial",
        },

        // Logo box on top-right
        {
          type: "rect",
          x: "70%",
          y: "3%",
          w: "14%",
          h: "10%",
          fill: "#F3F4F6",
          rx: 6,
          ry: 6,
        },
        {
          type: "image",
          bindTo: "logoUrl",
            x: "70%",
          y: "4%",
            w: "16%",
          h: "10%",
        },

        // Bottom footer strip
        {
          type: "rect",
          x: 0,
          y: "78%",
          w: "100%",
          h: "15%",
          fill: "{accent2}",
        },

        // Address block (left in footer)
        {
          type: "text",
          bindTo: "address1",
          x: "13%",
          y: "83%",
          fontSize: 14,
          fontWeight: 500,
          fill: "#374151",
          fontFamily: "Inter, system-ui, Arial",
        },
        // {
        //   type: "text",
        //   bindTo: "address2",
        //   x: "15%",
        //   y: "94%",
        //   fontSize: 12,
        //   fontWeight: 400,
        //   fill: "#6B7280",
        //   fontFamily: "Inter, system-ui, Arial",
        // },

        // Contact block (right in footer)
        {
          type: "text",
          bindTo: "phone",
          x: "65%",
          y: "83%",
          fontSize: 14,
          fontWeight: 500,
          fill: "#111827",
          fontFamily: "Inter, system-ui, Arial",
        },
        // {
        //   type: "text",
        //   bindTo: "email",
        //   x: "65%",
        //   y: "92%",
        //   fontSize: 12,
        //   fontWeight: 400,
        //   fill: "#4B5563",
        //   fontFamily: "Inter, system-ui, Arial",
        // },
        // {
        //   type: "text",
        //   bindTo: "web",
        //   x: "65%",
        //   y: "96%",
        //   fontSize: 12,
        //   fontWeight: 500,
        //   fill: "{primary}",
        //   fontFamily: "Inter, system-ui, Arial",
        // },
      ],
    },

    // Back side – minimal, just white
    back: {
      elements: [
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
      ],
    },
  },
}

  
];

export const findTemplate = (id) =>
  TEMPLATES.find((t) => t.id === id);
