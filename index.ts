import * as Types from "./src/types";

export * from "./src/types";

global.implReg = global.implReg || {};

/**
 * Init all common interfaces
 * @param {{logger: {new(): Interfaces.Logger}}} providers
 */
export function init(impl:{
    Logger?:{():Types._Logger},
    Tracelocal?:{():Types._Tracelocal}
}):void{
    if(!impl){
        throw new Error('Init Common param error.');
    }
    for(let nm in impl){
        reg(impl,nm);
    }
}

//--Tracelocal------------------------------------------------------------------------
let Tracelocal = genProxy<Types._Tracelocal>(Types._Tracelocal);
export {Tracelocal}

//--Logger------------------------------------------------------------------------

let Logger = genProxy<Types._Logger>(Types._Logger);
export {Logger}

//--------------------------------------------------------------------------
if (!Logger.implement) {
    init({
        Logger:()=>{
            return new class extends Types._Logger{
                public implement: string = 'default';

                trace(message:string):void{
                    console.log(message);
                }

                info(message:string):void{
                    console.log(message);
                }
    
                debug(message:string,error?:Error):void{
                    console.log(message);
                    error?()=>{
                        throw error
                    }:null;
                }
    
                warn(message:string,error?:Error):void{
                    console.log(message);
                    error?()=>{
                        throw error
                    }:null;
                }
    
                error(message:string,error?:Error):void{
                    console.log(message);
                    error?()=>{
                        throw error
                    }:null;
                }

                fatal(message:string,error?:Error):void{
                    console.log(message);
                    error?()=>{
                        throw error
                    }:null;
                }
            }();
        }
    });
}

function reg(_impl,_nm){
    if(_impl[_nm]){
        if(global.implReg[`${_nm}`]&&(_nm!=='Logger'&&_nm!=='Context')){ // Except logger
            throw new Error(`Common.${_nm} has been initializad.`);
        }
        global.implReg[`${_nm}`] = _impl[_nm]();
    }
}

function genProxy<T>(_Type): T {
    if(typeof(_Type)=='undefined'){
        throw new Error('Type is undefined.');
    }
    let newObj = new Object();
    let proto = _Type.prototype;
    let typeStr = proto.constructor.name.substring(1);

    let nms = Object.getOwnPropertyNames(proto);
    if(nms){
        nms.forEach((nm)=>{
            if(typeof (proto[nm])==='function'){
                if(nm!='constructor'){
                    newObj[nm] = function(){
                        if(global.implReg[typeStr]&& typeof global.implReg[typeStr][nm]==='function'){
                            return global.implReg[typeStr][nm].apply(this,arguments); //name is key
                        }
                        throw new Error(`No ${typeStr}.${nm} defined in Common.`);
                    }
                }
            }else if(typeof (proto[nm])=='object'&&nm!='id'){
                newObj[nm] = proto[nm];
            }else{
                Object.defineProperty(newObj,'id',{
                    get(){
                        if(global.implReg[typeStr]){
                            return global.implReg[typeStr][nm]; //name is key
                        }
                        throw new Error(`No ${typeStr}.${nm} defined in Common.`);
                    }
                })
            }
        })
    }

    // 标识实现方
    Object.defineProperty(newObj, 'implement', {
        get() {
            if (global.implReg[typeStr]) {
                return global.implReg[typeStr]['implement']; //name is key
            } else {
                return null;
            }
        }
    });

    return <T>newObj;
}
