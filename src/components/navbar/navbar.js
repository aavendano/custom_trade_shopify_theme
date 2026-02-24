export default function bNavbar() {
    return {
        drawer: false,
        mega: null,

        openMega(name) {
            this.mega = name;
        },

        closeMega() {
            this.mega = null;
        },
    }
}
