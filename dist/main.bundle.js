webpackJsonp([2],{

/***/ "../../../../../src async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "../../../../../src async recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".video-container {\n    margin: 20px;\n}\n\n.button-container {\n    margin: 20px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"row video-container\">\n\n  <div class=\"col-lg-12\">\n\n    <video id=\"me\" controls autoplay #me>\n    </video>\n  </div>\n\n  <div class=\"col-lg-12\">\n    <video id=\"device\" controls autoplay #remote>\n\n    </video>\n  </div>\n  \n  <div class=\"col-lg-12 button-container\">\n      <button (click)=\"showRemote()\" type=\"button\" class=\"btn btn-primary btn-lg\">\n            <span class=\"glyphicon glyphicon-facetime-video\" aria-hidden=\"true\"></span> Connect\n        </button>\n  </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__("../../../../angularfire2/database.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__("../../../../angularfire2/auth.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SERVERS = {
    iceServers: [
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};
var DEFAULT_CONSTRAINTS = {
    optional: []
};
var AppComponent = (function () {
    function AppComponent(afDb, afAuth) {
        this.afDb = afDb;
        this.afAuth = afAuth;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.setupWebRtc();
    };
    AppComponent.prototype.setupWebRtc = function () {
        var _this = this;
        this.senderId = this.guid();
        var channelName = '/webrtc';
        this.channel = this.afDb.list(channelName);
        this.database = this.afDb.database.ref(channelName);
        this.database.on('child_added', this.readMessage.bind(this));
        this.pc = new RTCPeerConnection(SERVERS, DEFAULT_CONSTRAINTS);
        this.pc.onicecandidate = function (event) {
            return event.candidate
                ? _this.sendMessage(_this.senderId, JSON.stringify({ ice: event.candidate }))
                : console.log('Sent All Ice');
        };
        this.pc.ontrack = function (event) {
            return (_this.remote.nativeElement.srcObject = event.streams[0]);
        }; // use ontrack
        this.showMe();
    };
    AppComponent.prototype.sendMessage = function (senderId, data) {
        var msg = this.channel.push({
            sender: senderId,
            message: data
        });
        msg.remove();
    };
    AppComponent.prototype.readMessage = function (data) {
        var _this = this;
        // tslint:disable-next-line:curly
        if (!data)
            return;
        var msg = JSON.parse(data.val().message);
        var sender = data.val().sender;
        if (sender !== this.senderId) {
            // tslint:disable-next-line:curly
            if (msg.ice !== undefined)
                this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
            else if (msg.sdp.type === 'offer')
                this.pc
                    .setRemoteDescription(new RTCSessionDescription(msg.sdp))
                    .then(function () { return _this.pc.createAnswer(); })
                    .then(function (answer) { return _this.pc.setLocalDescription(answer); })
                    .then(function () {
                    return _this.sendMessage(_this.senderId, JSON.stringify({ sdp: _this.pc.localDescription }));
                });
            else if (msg.sdp.type === 'answer')
                this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
    };
    AppComponent.prototype.showMe = function () {
        var _this = this;
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(function (stream) { return (_this.me.nativeElement.srcObject = stream); })
            .then(function (stream) { return _this.pc.addStream(stream); });
    };
    AppComponent.prototype.showRemote = function () {
        var _this = this;
        this.pc
            .createOffer()
            .then(function (offer) { return _this.pc.setLocalDescription(offer); })
            .then(function () {
            return _this.sendMessage(_this.senderId, JSON.stringify({ sdp: _this.pc.localDescription }));
        });
    };
    AppComponent.prototype.guid = function () {
        return (this.s4() +
            this.s4() +
            '-' +
            this.s4() +
            '-' +
            this.s4() +
            '-' +
            this.s4() +
            '-' +
            this.s4() +
            this.s4() +
            this.s4());
    };
    AppComponent.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return AppComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* ViewChild */])('me'),
    __metadata("design:type", Object)
], AppComponent.prototype, "me", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* ViewChild */])('remote'),
    __metadata("design:type", Object)
], AppComponent.prototype, "remote", void 0);
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_1" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["b" /* AngularFireDatabase */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["b" /* AngularFireDatabase */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["b" /* AngularFireAuth */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["b" /* AngularFireAuth */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2__ = __webpack_require__("../../../../angularfire2/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__("../../../../angularfire2/database.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__ = __webpack_require__("../../../../angularfire2/auth.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_6__environments_environment__["a" /* environment */].firebase, __WEBPACK_IMPORTED_MODULE_6__environments_environment__["a" /* environment */].appName),
            __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabaseModule */],
            __WEBPACK_IMPORTED_MODULE_5_angularfire2_auth__["a" /* AngularFireAuthModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false,
    appName: "webrtc-angularfire2",
    firebase: {
        apiKey: "AIzaSyAcMOgG58ZIfB0Mr62tpUS6YUB8wpnvIJg",
        authDomain: "webrtc-e1eeb.firebaseapp.com",
        databaseURL: "https://webrtc-e1eeb.firebaseio.com",
        projectId: "webrtc-e1eeb",
        storageBucket: "",
        messagingSenderId: "276952673200"
    }
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map