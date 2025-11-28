import React, { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

// helper component to allow transforming a Konva image
function URLImage({ imageObj, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(imageObj.url, "anonymous"); // avoid CORS tainting

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        x={imageObj.x}
        y={imageObj.y}
        width={imageObj.width}
        height={imageObj.height}
        draggable
        rotation={imageObj.rotation}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ ...imageObj, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // reset scale to avoid nested scaling
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...imageObj,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled enabledAnchors={[
        "top-left","top-right","bottom-left","bottom-right","middle-left","middle-right","top-center","bottom-center"
      ]} />}
    </>
  );
}

export default function TshirtDesigner({ apiBase = "" }) {
  const stageRef = useRef();
  const [images, setImages] = useState([]); // list of {id, url, x, y, width, height, rotation}
  const [selectedId, setSelectedId] = useState(null);
  const backgroundUrl = "/mockups/white-tshirt-front.png"; // your tshirt mockup

  // Add an uploaded image (either local object URL or remote uploaded URL)
  function addImage(url) {
    const id = `img_${Date.now()}`;
    // default size + position (centered)
    setImages((prev) => [
      ...prev,
      {
        id,
        url,
        x: 120,
        y: 120,
        width: 240,
        height: 150,
        rotation: 0,
      },
    ]);
    setSelectedId(id);
  }

  // handle local upload -> post to server then add remote url
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Option A: Immediate local preview without uploading
    const objectUrl = URL.createObjectURL(file);
    addImage(objectUrl);

    // Option B (recommended): upload to server/cloud and use returned URL
    // const form = new FormData();
    // form.append('file', file);
    // const res = await fetch(`${apiBase}/api/uploads`, { method: 'POST', body: form });
    // const data = await res.json();
    // addImage(data.url); // server should return accessible URL
  }

  // Save/export final canvas as PNG and POST to server (for print)
  async function handleSaveDesign() {
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    // send to server as base64 or blob
    const blob = await (await fetch(dataURL)).blob();
    const fd = new FormData();
    fd.append("file", blob, "design.png");

    const res = await fetch(`${apiBase}/api/uploads`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      alert("Upload failed");
      return;
    }
    const body = await res.json();
    alert("Saved: " + body.url);
  }

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* Left column: tools */}
      <div style={{ width: 260 }}>
        <h3>Design Tools</h3>

        <label className="block">
          Upload image
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <button onClick={() => stageRef.current.toDataURL() && handleSaveDesign()}>
          Save design / Export
        </button>

        <div style={{ marginTop: 20 }}>
          <h4>Layers</h4>
          {images.map((img) => (
            <div key={img.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <button onClick={() => setSelectedId(img.id)} style={{ flex: 1 }}>{img.id}</button>
              <button onClick={() => setImages(images.filter(i=>i.id !== img.id))}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <Stage width={900} height={600} ref={stageRef} style={{ border: "1px solid #ddd", background: "#fff" }}>
          <Layer>
            {/* Mockup background */}
            <KonvaImage
              image={useImage(backgroundUrl)[0]}
              x={0}
              y={0}
              width={900}
              height={600}
              listening={false}
            />
          </Layer>

          <Layer>
            {images.map((img) => (
              <URLImage
                key={img.id}
                imageObj={img}
                isSelected={selectedId === img.id}
                onSelect={() => setSelectedId(img.id)}
                onChange={(newAttrs) =>
                  setImages((prev) => prev.map((p) => (p.id === newAttrs.id ? newAttrs : p)))
                }
              />
            ))}
          </Layer>

          {/* Optional overlay for bleed/safety area: */}
          <Layer listening={false}>
            <rect x={80} y={120} width={740} height={360} stroke="#00c" dash={[6, 4]} />
            <text x={100} y={130} text="Safety area" fontSize={14} fill="#00c" />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
