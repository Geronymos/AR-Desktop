import { registerComponent } from "aframe";


export default registerComponent('tabcapture', {
    schema: {

    },
    init: function () {
    },

    update: function () {
        const plane = this.el;
        const self = this;


        this.captureTab();

    },

    captureTab: async function() {
        const self = this;
        
        this.el.setAttribute("src", await browser.tabs.captureVisibleTab());
        this.captureTab();
        
    }

});