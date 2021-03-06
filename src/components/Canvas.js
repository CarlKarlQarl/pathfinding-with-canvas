import React, { useRef, useState, useEffect } from "react"

function drawCircle(ctx, location) {
    const { x, y } = location
    ctx.fillStyle = "#000000"
    ctx.beginPath()
    ctx.arc(x, y - 42, 1.5, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
}

function drawLine(ctx, locations) {
    const locationLength = Object.keys(locations).length
    if (locationLength > 1){
        for (let index = 1; index < locationLength; index++){
            ctx.beginPath();
            ctx.moveTo(locations[index - 1].x, locations[index - 1].y - 42);
            ctx.lineTo(locations[index].x, locations[index].y - 42);
            ctx.stroke();
        }
    }
}

function usePersistentState(init){
    const [ value, setValue ] = useState(JSON.parse(localStorage.getItem("draw-app")) || init)
    useEffect(() => localStorage.setItem("draw-app", JSON.stringify(value)))
    return [value, setValue]
}

function usePersistentCanvas(){
    const canvasRef = useRef(null)
    const [ locations, setLocations ] = usePersistentState([])
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
        locations.forEach(location => drawCircle(ctx, location))
        drawLine(ctx, locations)
    })
    return [locations, setLocations, canvasRef]
}

function Canvas() {
    const [ locations, setLocations, canvasRef ] = usePersistentCanvas()

    function handleCanvasClick(event){
        const newLocation = { x: event.clientX, y: event.clientY }
        setLocations([...locations, newLocation])
    }
    function handleClear(){setLocations([])}
    function handleUndo(){setLocations(locations.slice(0, -1))}

    return(
        <>
            <div className="controls">
                <button onClick={handleClear}>Clear</button>
                <button onClick={handleUndo}>Undo</button>
            </div>
            <canvas 
                id="canvas" 
                ref={canvasRef}
                width={window.innerHeight}
                height={window.innerHeight}
                onClick={handleCanvasClick}
            />
        </> 
    )
}

export default Canvas