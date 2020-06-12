import {Lightning, Utils, MediaPlayer} from "wpe-lightning-sdk";
import {getFormattedTime} from '../lib/tools'

export default class Player extends Lightning.Component {
    static _template() {
        return {
            MediaPlayer: {
                type: MediaPlayer
            },
            Overlay: {
                rect: true, w: 1920, h: 200, y: 1080, mountY: 1, colorTop:0x00000000, colorBottom: 0xff000000
            },
            Controls: {
                alpha: 0, x:50, y:1000,
                PlayPause: {
                    src: Utils.asset("mediaplayer/play.png")
                },
                Skip: {
                    x: 50,
                    src: Utils.asset("mediaplayer/skip.png")
                },
                Progress: {
                    x: 100, y:10,
                    Bar:{
                        rect: true, color:0x20ffffff, h:10, w:1550
                    },
                    Duration:{
                        rect: true, color:0xffffffff, h:10
                    }
                },
                Info: {
                    x: 1750, y: 10, mount: 0.5,
                    text: {text: '', fontSize: 35, fontFace: "SourceSansPro-Regular"}
                }
            }
        };
    }

    _init() {
        this.tag("MediaPlayer").updateSettings({
            consumer: this
        });
    }

    _focus(){
        this.application.emit("toggleBackgound", true);
        this.tag("Controls").alpha = 1;
    }

    _unfocus(){
        this.tag("Controls").alpha = 0;
        this.application.emit("toggleBackgound", false);
    }

    play(src, loop) {
        this.tag("MediaPlayer").open(src);
        this.tag("MediaPlayer").loop = loop;
    }

    stop() {
        this.tag("MediaPlayer").close();
    }

    set item(v){
        this.play(v.stream, true);
    }

    _handleEnter(){
        this.tag("MediaPlayer").doPause();
    }

    _handleRight(){
        this.tag("MediaPlayer").getPosition().then((__currentPos)=>{
            console.log(__currentPos);
            this.tag("MediaPlayer").setPosition(__currentPos + 5);
        })
    }

    $mediaplayerPause() {
        this._setState("Paused")
    }

    $mediaplayerPlay() {
        this._setState("Playing");
    }

    showProgress(currentTime, duration) {
        const p = currentTime / Math.max(duration, 1);
        this.tag("Duration").setSmooth("w", p*1550);
        this.tag("Info").text.text = `${getFormattedTime(p*10)}/${getFormattedTime(duration)}`;
    }

    static _states(){
        return [
            class Playing extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/pause.png");
                }
                $mediaplayerProgress({currentTime, duration}) {
                    this.showProgress(currentTime, duration);
                }
            },
            class Paused extends this{
                $enter(){
                    this.tag("PlayPause").src = Utils.asset("mediaplayer/play.png");
                }
                _handleEnter(){
                    this.tag("MediaPlayer").doPlay();
                }
            }
        ]
    }
}