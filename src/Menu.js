
const Menu = ({onChangeTypeLine, updateLinesHandle, startResciveHandle}) => 
<div className="menu">
	<fieldset>
        <legend>Type for line</legend>
		<label>
            <input onChange={onChangeTypeLine} type="radio" name="rtoggle" value="{1}" defaultChecked="true"/>
            Use Navigation
        </label>
		<label>
            <input onChange={onChangeTypeLine} type="radio" name="rtoggle" value=""/>
            Direct line
        </label>
    </fieldset>
	<fieldset>
        <legend>Enter coordinates and click on "Send"</legend>
		<input type="text" name="coordinates_lat" placeholder="lat" disabled={true}/>
		<input type="text" name="coordinates_lng" placeholder="lng" disabled={true}/>
	</fieldset>
	<fieldset>
        <legend>Activitis</legend>
        <button onClick={updateLinesHandle}>Send(Update lines)</button>
        <button onClick={startResciveHandle}>Start(Send to tank and start drive)</button>
    </fieldset>
</div>;

export default Menu;
