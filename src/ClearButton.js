import './ClearButton.css'

const ClearButton = props => {

    const isAnimate = props.animate ?? true;

    const handler = isAnimate ? e => {
        e.currentTarget.classList.add('animate-deletion');
        console.log(e.currentTarget.style.display);
        e.currentTarget.onanimationend = props.onClickClear;
    } : props.onClickClear;

    return <button className="clear-button" 
    onClick={handler}>Отчистить маршрут</button>;
}

export default ClearButton;
