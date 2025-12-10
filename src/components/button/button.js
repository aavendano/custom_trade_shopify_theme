export default () => {
    return {
        clicked: false,
        handleClick() {
            this.clicked = true;
            console.log("Button clicked!");
        }
    }
}
