  export const TEMPLATES = [
    {
      id: "vp_ribbon_front",
      name: "Vistaprint – Ribbon (Front)",
      palettes: [
        { id: "red",   bg: "#FFFFFF", primary: "#333333", accent: "#C52B2B", accent2: "#8F1E1E" },
        { id: "blue1", bg: "#FFFFFF", primary: "#333333", accent: "#2C6CB0", accent2: "#1D4E86" },
        { id: "blue2", bg: "#FFFFFF", primary: "#333333", accent: "#4EA3D8", accent2: "#327CA8" },
        { id: "olive", bg: "#FFFFFF", primary: "#333333", accent: "#9BC243", accent2: "#6F8E2A" },
      ],
      elements: [
        // Backgrounds
        { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },
        { type: "rect", x: "0%", y: 0, w: "10%", h: "100%", fill: "#E5E7EB" },

        // Logo
        { type: "image", bindTo: "logoUrl", x: "58%", y: "15%", w: "18%", h: "20%" },

        // Top-left text block
        { type: "text", bindTo: "fullName", x: "14%", y: "15%", fontSize: 24, fontWeight: 700, fill: "{accent}",fontFamily: "Playfair Display" },
        { type: "text", bindTo: "jobTitle", x: "14%", y: "23%", fontSize: 16, fontWeight: 400, fill: "{primary}", fontFamily: "Playfair Display" },
        { type: "text", bindTo: "email",    x: "14%", y: "30%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },

        // Ribbon + tail
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

        // Company name + message on/near ribbon
        { type: "text", bindTo: "companyName",    x: "58%", y: "44%",  fontSize: 20, fontWeight: 700, fill: "#FFFFFF", fontFamily: "Playfair Display"},


        // Left bottom address
        { type: "text", bindTo: "address1",     x: "14%", y: "56%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
        { type: "text", bindTo: "address2",     x: "14%", y: "62%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
        { type: "text", bindTo: "cityStatePin", x: "14%", y: "68%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },

        // Right-side contacts
        { type: "text", bindTo: "phone", x: "58%", y: "56%", fontSize: 16, fontWeight: 400, fill: "{primary}" , fontFamily: "Playfair Display"},
        { type: "text", bindTo: "fax",   x: "58%", y: "62%", fontSize: 16, fontWeight: 400, fill: "#333", fontFamily: "Playfair Display" },
        { type: "text", bindTo: "web",   x: "58%", y: "68%", fontSize: 16, fontWeight: 400, fill: "{accent}", fontFamily: "Playfair Display" },
      ],
    },
    

  {
    id: "vp_top_banner",
    name: "Top Banner (Front)",
    palettes: [
      { id: "olive", bg: "#FFFFFF", primary: "#333333", accent: "#9BC243", accent2: "#6F8E2A" },
      { id: "ocean", bg: "#FFFFFF", primary: "#1F2937", accent: "#2563EB", accent2: "#1E40AF" },
      { id: "red",   bg: "#FFFFFF", primary: "#333333", accent: "#C52B2B", accent2: "#8F1E1E" },
        { id: "blue1", bg: "#FFFFFF", primary: "#333333", accent: "#2C6CB0", accent2: "#1D4E86" },
        { id: "blue2", bg: "#FFFFFF", primary: "#333333", accent: "#4EA3D8", accent2: "#327CA8" },
    ],
    elements: [
      { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

      // top banner
      { type: "rect", x: 0, y: 0, w: "100%", h: "22%", fill: "{accent}" },
      { type: "rect", x: 0, y: "22%", w: "100%", h: 4, fill: "{accent2}" },

      // logo on banner (circle)
      { type: "image", bindTo: "logoUrl", x: "6%", y: "4%", w: "18%", h: "16%"},

      // company on banner (right)
      { type: "text", bindTo: "companyName", x: "32%", y: "10%", fontSize: 28, fontWeight: 800, fill: "#FFFFFF" },

      // identity under banner
      { type: "text", bindTo: "fullName", x: "8%", y: "30%", fontSize: 28, fontWeight: 700, fill: "{primary}" },
      { type: "text", bindTo: "jobTitle", x: "8%", y: "39%", fontSize: 20, fontWeight: 500, fill: "#333" },

      // two-column details
      { type: "text", bindTo: "email",        x: "8%",  y: "52%", fontSize: 16, fill: "#333" },
      { type: "text", bindTo: "phone",        x: "8%",  y: "58%", fontSize: 16, fill: "{primary}" },
      { type: "text", bindTo: "fax",          x: "8%",  y: "64%", fontSize: 16, fill: "#333" },
      { type: "text", bindTo: "web",          x: "8%",  y: "70%", fontSize: 16, fill: "{accent}" },

      { type: "text", bindTo: "address1",     x: "56%", y: "52%", fontSize: 18, fill: "#333" },
      { type: "text", bindTo: "address2",     x: "56%", y: "58%", fontSize: 18, fill: "#333" },
      { type: "text", bindTo: "cityStatePin", x: "56%", y: "64%", fontSize: 18, fill: "#333" },
    ],
  },
  {
  id: "vp_bottom_wave",
  name: "Bottom Wave (Front)",
  palettes: [
    { id: "royal", bg: "#FFFFFF", primary: "#222222", accent: "#004AAD", accent2: "#002E73" },
    { id: "emerald", bg: "#FFFFFF", primary: "#1B4332", accent: "#40916C", accent2: "#2D6A4F" },
    { id: "ruby", bg: "#FFFFFF", primary: "#2B1D1D", accent: "#D00000", accent2: "#9D0208" },
    { id: "sunset", bg: "#FFFFFF", primary: "#2D1B00", accent: "#E85D04", accent2: "#BB3E03" },
  ],
  elements: [
    // Background
    { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

    // Bottom wave banner
    {
      type: "polygon",
      fill: "{accent}",
      points: [
        { x: "10%",  y: "100%" },
        // { x: "20%", y: "78%" },
        // { x: "40%", y: "84%" },
        // { x: "60%", y: "78%" },
        // { x: "80%", y: "84%" },
        { x: "100%", y: "0%" },
        { x: "100%", y: "100%" },
        // { x: "0%",  y: "100%" },
      ]
    },
    // Thin highlight on top of wave
    {
      type: "polygon",
      fill: "{accent2}",
      points: [

      ]
    },

    // Logo (top-right)
    { type: "image", bindTo: "logoUrl", x: "54%", y: "15%", w: "18%", h: "18%" },

    // Name + Job Title
    { type: "text", bindTo: "fullName", x: "8%", y: "16%", fontSize: 32, fontWeight: 800, fill: "{primary}", fontFamily: "Playfair Display" },
    { type: "text", bindTo: "jobTitle", x: "8%", y: "28%", fontSize: 28, fontWeight: 500, fill: "#4B5563", fontFamily: "Poppins" },

    // Company name (mid card)
    { type: "text", bindTo: "companyName", x: "8%", y: "40%", fontSize: 26, fontWeight: 700, fill: "{accent}", fontFamily: "Montserrat" },

    // Contact details left column
    { type: "text", bindTo: "email", x: "8%", y: "53%", fontSize: 18, fontWeight: 400, fill: "#333", fontFamily: "Open Sans" },
    { type: "text", bindTo: "phone", x: "8%", y: "60%", fontSize: 18, fontWeight: 400, fill: "#333", fontFamily: "Open Sans" },
    { type: "text", bindTo: "fax",   x: "8%", y: "66%", fontSize: 18, fontWeight: 400, fill: "#333", fontFamily: "Open Sans" },

    // Address block on right side8
    { type: "text", bindTo: "address1",     x: "56%", y: "58%", fontSize: 20, fontWeight: 400, fill: "#fff", fontFamily: "Roboto" },
    { type: "text", bindTo: "address2",     x: "56%", y: "65%", fontSize: 20, fontWeight: 400, fill: "#fff", fontFamily: "Roboto" },
    // { type: "text", bindTo: "cityStatePin", x: "56%", y: "72%", fontSize: 15, fontWeight: 400, fill: "#555", fontFamily: "Roboto" },

    // Website above wave
    { type: "text", bindTo: "web", x: "35%", y: "84%", fontSize: 17, fontWeight: 600, fill: "#FFFFFF", fontFamily: "Poppins" },
  ],

}
// {
//   id: "vp_left_bar",
//   name: "Left Bar (Front)",
//   palettes: [
//     { id: "ink",     bg: "#FFFFFF", primary: "#1F2937", accent: "#0F172A", accent2: "#334155" },
//     { id: "teal",    bg: "#FFFFFF", primary: "#0F3B3A", accent: "#0D9488", accent2: "#0F766E" },
//     { id: "plum",    bg: "#FFFFFF", primary: "#2C1B2E", accent: "#7C3AED", accent2: "#5B21B6" },
//     { id: "crimson", bg: "#FFFFFF", primary: "#2B1616", accent: "#DC2626", accent2: "#991B1B" },
//   ],
//   elements: [
//     // Base
//     { type: "rect", x: 0, y: 0, w: "100%", h: "100%", fill: "{bg}" },

//     // Left vertical bar
//     { type: "rect", x: 0, y: 0, w: "35%", h: "100%", fill: "{accent}" },
//     // thin accent line along the bar edge
//     { type: "rect", x: "36%", y: 0, w: 3, h: "100%", fill: "{accent2}" },

//     // Logo badge overlapping the bar5
//     { type: "image", bindTo: "logoUrl", x: "5%", y: "10%", w: "20%", h: "20%", },

//     // Company stacked in bar
//     { type: "text", bindTo: "Company", x: "44%", y: "9%", fontSize: 50, fontWeight: 800, fill: "#333", fontFamily: "Nunito" },
//         { type: "text", bindTo: "name", x: "49%", y: "22%", fontSize: 50, fontWeight: 800, fill: "#333", fontFamily: "Nunito" },
//     // { type: "text", bindTo: "companyMessage", x: "6%", y: "49%", fontSize: 12, fontWeight: 500, fill: "#E5E7EB", fontFamily: "Nunito" },

//     // Name block (right side)
//     { type: "text", bindTo: "fullName", x: "47%", y: "40%", fontSize: 38, fontWeight: 800, fill: "{primary}", fontFamily: "Lora" },
//     { type: "text", bindTo: "jobTitle", x: "50%", y: "50%", fontSize: 26, fontWeight: 600, fill: "#333", fontFamily: "Inter" },

//     // Contact (two columns)
//     { type: "text", bindTo: "email", x: "5%", y: "40%", fontSize: 15, fontWeight: 500, fill: "#fff", fontFamily: "Source Sans Pro" },
//     { type: "text", bindTo: "phone", x: "5%", y: "47%", fontSize: 15, fontWeight: 500, fill: "#fff", fontFamily: "Source Sans Pro" },
//     { type: "text", bindTo: "office",   x: "5%", y: "54%", fontSize: 14, fontWeight: 500, fill: "#fff", fontFamily: "Source Sans Pro" },

   

//     // Website footer call-out
//     { type: "text", bindTo: "web", x: "53%", y: "68%", fontSize: 17, fontWeight: 700, fill: "{accent}", fontFamily: "Nunito" },
//   ],
// }



  ];

  export const findTemplate = (id) => TEMPLATES.find((t) => t.id === id);
