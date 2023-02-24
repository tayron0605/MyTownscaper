import { Singleton } from "./Singleton";

export class Utils{
    static limit(src: number, min: number, max: number) {
        return Math.min(max, Math.max(min, src));
    }

    public static urlencode (str) {  
        str = (str + '').toString();   
    
        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
    }

    public static UrlDecode(zipStr){ 
        var uzipStr = ''; 
        for (var i = 0; i < zipStr.length; i += 1) {
          var chr = zipStr.charAt(i); 
          if (chr === '+') { 
            uzipStr += ' ';
          } else if (chr === '%') { 
            var asc = zipStr.substring(i + 1, i + 3); 
            if (parseInt('0x' + asc) > 0x7f) {
              uzipStr += decodeURI('%' + asc.toString() + zipStr.substring(i+3, i+9).toString()); 
              i += 8;
            }else{ 
              uzipStr += this.AsciiToString(parseInt('0x' + asc)); 
              i += 2;
            } 
          }else{ 
            uzipStr += chr; 
          } 
        } 
      
        return uzipStr; 
    }
       
    public static StringToAscii(str){ 
    return str.charCodeAt(0).toString(16); 
    }
    
    public static AsciiToString(asccode){ 
    return String.fromCharCode(asccode); 
    }
      
    public static isJSON(str) :boolean{
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }
            } catch(e) {
                console.log('error：'+str+'!!!'+e);
                return false;
            }
        }
        console.log('It is not a string!')
    }

    //验证字符串是否是数字
    public static checkNumber(theObj):boolean{
        let reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(theObj)){
            return true;
        }else{
            return false;
        }
    }

    //计算两个日期之间相差多少天，考虑同一天的情况
    public static calculateLeftDayTime(date1:Date,date2:Date):number
    {
        let oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        let diffDays = Math.floor(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
        if(diffDays==0)//需要考虑最后一天隔天的情况
        {
            if(date1.getFullYear()!=date2.getFullYear()||date1.getMonth()!=date2.getMonth()||date1.getDate()!=date2.getDay())
            {
                diffDays=1;
            }
        }
        return diffDays;
    }

    //给出一个开始时间，计算获得多少天后的一个实际时间
    public static calculateEndTimeByDay(startS:number,dayNum:number):Date
    {
        let timeMs = startS*1000;
        let startDate = new Date(timeMs); // 假设这是开始时间
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        let endDate = new Date(startDate.getTime() + (dayNum * 24 * 60 * 60 * 1000)); // 30天后的结束时间

       
        // let now = new Date(); // 当前时间

        // if (now.getTime() >= startDate.getTime() && now.getTime() <= endDate.getTime()) {
        // console.log("当前时间在开始时间和结束时间之间");
        // } else {
        // console.log("当前时间不在开始时间和结束时间之间");
        // }
        return endDate;

    }

    // 判断是不是同一天
    public static isTheSameDate(date:Date)
    {
        let curData = new Date(Date.now());
        return curData.getFullYear() == date.getFullYear() && curData.getMonth() == date.getMonth() && curData.getDay() == date.getDay();
    }

    public static randomArr(arr){
        return arr[Math.floor(Math.random() * arr.length)]
      }

    public static getNumFormat(value:number, radix:number):string{
		let value16 = value.toString(16);
		var zero = '00000000';
		var tmp = 8-value16.length;
		return zero.substr(0,tmp) + value16;
	}

    public static getDateStringToDay(date:Date):string
    {
        return `${date.getFullYear()}_${date.getMonth()}_${date.getDay()}`
    }

    public static isSameDateToDay(dateStr:string):boolean
    {
        let curData = new Date(Date.now());
        return dateStr ==`${curData.getFullYear()}_${curData.getMonth()}_${curData.getDay()}`
    }

    public static getNextDayZero(oldTimeMs:number=null):Date
    {
        let date = new Date();
        if(oldTimeMs)
        {
            date = new Date(oldTimeMs);
        }
        var endDateMs =date.setHours(24, 0, 0, 0);
        return new Date(endDateMs);
    }

    public static getNextMin():Date
    {
        let date = new Date();
        var endDateMs = date.getTime()+60*1000;
        return new Date(endDateMs);
    }

    public static getNext30Sec():Date
    {
        let date = new Date();
        var endDateMs = date.getTime()+30*1000;
        return new Date(endDateMs);
    }

    // 获取下周一日期
    public static getNextMonday(oldTimeMs:number):Date
    {
        var date = new Date(oldTimeMs);
        //今天是周日需要特判
        if(date.getDay()==0)
        {
            return Utils.getNextDayZero(oldTimeMs);
        }
        else
        {
            date.setDate(date.getDate() + (8 - date.getDay()));
            var y = date.getFullYear(); 
            var m = date.getMonth() + 1; 
            var d = date.getDate();
            var mvar:number|string = '',dvar:number|string = '';
            m < 10 ? mvar = '0' + m : (mvar = m);
            d < 10 ? dvar = '0' + d : (dvar = d);
            return new Date(y + "-" + mvar + '-' + dvar);
        }

    }

    public static getNextMonthFirstDay(oldTimeMs:number):Date
    {
        let date = new Date(oldTimeMs);
        var year = date.getFullYear();
        var month:number|string = date.getMonth()+1;
        if(month<10){
            month = "0"+month;
        }
        // 获取上个月最后一天的毫秒数
        var m = date.getMonth()+2;
        var y = year;
        if(m>12){
            m = 1;
            y = y +1;
        }
        var str2 = y+"-"+m+"-01 00:00:00";
        // 获取下个月第一天
        var next = new Date(str2);
        return next;
    }

    public static DeleteEleFromArr(arr:any[],value):Array<any>
    {
        if(arr&&arr.length)
        {
            let index = arr.indexOf(value); 
            if (index > -1) { 
                arr.splice(index, 1); 
            } 
        }
        return arr;
    }
    

    public static Shift(uBase,uShift){
        return uBase |= 1 << uShift;
    }

    public static CheckShift(uBase,uShift){
        return Utils.CHECK_TYPE(uBase,1 << uShift);
    }

    public static TestBit(uBase,uTest){
        return Utils.CHECK_TYPE(uBase,uTest);
    }

    public static OnBit(uBase,uTest){
        return uBase|uTest;
    }

    public static OffBit(uBase,uTest){
        return uBase &= (~( 1 << uTest ));
    }

    public static CHECK_TYPE(origin,type){
        return (origin&type)!=0?true:false;
    }
    
    public static SplitToStrings(src: string, sep: string): string[] {
        let res: string[] = [];
        if(typeof src != "string"){
            src = src + '';
        }
        if (src) {
            return src.split(sep);
        }
        return res;
    }

    public static SplitToNumbers(src: string, sep: string): number[] {
        let res: number[] = [];
        if(typeof src != "string"){
            src = src + '';
        }
        if (src) {
            let tmp = src.split(sep);
            for (let v of tmp) {
                res.push(Number(v));
            }
        }
        return res;
    }

    public static getTextureName(atlasText:string)
    {
        let lines = atlasText.split(/\r\n|\r|\n/);
        let line = lines[0];
        if(line.endsWith(".png")) return line;
        line = lines[1];
        return line;
    }

    public static getFormatString(format:string, ...params: any[])
    {
        if(!params || params.length == 0) return format;

        for(let i = 0; i < params.length; ++i)
        {
            format = format.replace("{s" + i + "}", params[i].toString())
        }
        return format;
    }
    
    public static RandomInt(begin,end){ //[2,5]->[0,4)->floor->[0,3]+2->[2,5]
        return Math.floor(Math.random()*(end - begin + 1) + begin);
    }

    public static RandomWeightIdx(weights:number[])
    {
        let w = 0;
        for(let i = 0; i < weights.length; ++i) w += weights[i];
        let r = this.RandomInt(0, w);
        for(let i = 0; i < weights.length; ++i)
        {
            if( r < weights[i]) return i;
            r -= weights[i];
        }
        return weights.length -1;
    }

    public static FS_ToInt(a) {
        if (a == undefined) {
            return undefined
        }
        return Math.floor(a + 0.5)
    }

    public static FS_Equal(a, b, pricision = 1000) {
        if (a == undefined && b == undefined) {
            return true
        }
        
        if (a != undefined && b != undefined) {
            return Math.floor(a * pricision + 0.5) == Math.floor(b * pricision + 0.5)
        }
        return false
    }

    public static FS_NotEqual(a, b, pricision = 1000) {
        if (a == undefined && b == undefined) {
            return false
        }
        
        if (a != undefined && b != undefined) {
            return Math.floor(a * pricision + 0.5) != Math.floor(b * pricision + 0.5)
        }
        return true
    }

    public static FS_Greater(a, b, pricision = 1000) {
        return Math.floor(a * pricision + 0.5) > Math.floor(b * pricision + 0.5)
    }

    public static FS_GreaterE(a, b, pricision = 1000) {
        return Math.floor(a * pricision + 0.5) >= Math.floor(b * pricision + 0.5)
    }

    public static FS_Less(a, b, pricision = 1000) {
        return Math.floor(a * pricision + 0.5) < Math.floor(b * pricision + 0.5)
    }

    public static FS_LessE(a, b, pricision = 1000) {
        return Math.floor(a * pricision + 0.5) <= Math.floor(b * pricision + 0.5)
    }

    public static FS_ToFix(value){
        return Math.floor(value*10000)/10000;
    }

    public static FS_MathSin(value){
        return Utils.FS_ToFix(Math.sin(value));
    }

    public static FS_MathCos(value){
        return Utils.FS_ToFix(Math.cos(value));
    }

    public static FS_MathAbs(value){
        return Utils.FS_ToFix(Math.abs(value));
    }

    public static FS_MathSqrt(value){
        return Utils.FS_ToFix(Math.sqrt(value));
    }

    public static FS_MathAtan2(a,b){
        return Utils.FS_ToFix(Math.atan2(a,b));
    }

    // 深拷贝Object
    public static DeepCopyObject(src: any, dst?: any): any {
        if (src === undefined || src === null || typeof(src) === "function") {
            return src;
        }
        if (src.constructor == Array) {
            if (typeof(dst) !== "object" || dst.constructor !== Array) {
                dst = [];
            }

            for (let i = 0; i < src.length; i++) {
                let value = src[i];
                if (typeof(value) === "object") {
                    dst.push(this.DeepCopyObject(value));
                } else {
                    dst.push(value);
                }
            }
            return dst;
        }
        
        if (typeof(dst) !== "object") {
            dst = {};
        }
        for (let key in src) {
            let value = src[key];
            if (value === undefined || value === null) {
                continue;
            }

            if (typeof(value) === "object") {
                dst[key] = this.DeepCopyObject(value);
            } else {
                dst[key] = value;
            }
        }
        return dst;
    }
    //value是string或者number类型的map序列化成数组
    public static Map2KVArray(srcMap:Map<any,any>){
        let arrTmp = [];
        srcMap.forEach((v,k,m)=>{
            if((typeof(v) == 'string'
                ||typeof(v) == 'number')
                &&
                typeof(k) == 'string'
                ||typeof(v)== 'number')
            {
                let kv = k+"|"+v;
                arrTmp.push(kv);
            }
            
        })
        return Array.from(arrTmp);
    }

    public static KVArray2Map_Num(srcArr:string[],dstMap:Map<number,number>){
        srcArr.forEach((v,k,m)=>{
            let out = Utils.SplitToNumbers(v, "|");
            dstMap.set(out[0],out[1]);
        })
    }

    // 对比两个Object值是否相等
    public static IsObjectEqual(obj1: any, obj2: any, vecFilter?: string[]): boolean {
        if (obj1 !== obj2) {
            if (typeof(obj1) !== "object" || typeof(obj2) !== "object") {
                return false;
            }
            if (obj1.constructor === Array) {
                if (obj2.constructor !== Array) {
                    return false;
                }
                if (obj1.length != obj2.length) {
                    return false;
                }
                for (let i = 0; i < obj1.length; ++i) {
                    if (!this.IsObjectEqual(obj1[i], obj2[i])) {
                        return false;
                    }
                }
                return true;
            }

            for (let key in obj1) {
                if (vecFilter && vecFilter.indexOf(key) != -1) {
                    continue;
                }
                let v1 = obj1[key];
                if (v1 === undefined || v1 === null || typeof(v1) === "function") {
                    continue;
                }
                if (!this.IsObjectEqual(v1, obj2[key])) {
                    return false;
                }
            }

            for (let key in obj2) {
                if (vecFilter && vecFilter.indexOf(key) != -1) {
                    continue;
                }
                let v2 = obj2[key];
                if (v2 === undefined || v2 === null || typeof(v2) === "function") {
                    continue;
                }
                let v1 = obj1[key];
                if (v1 !== undefined && v1 !== null) {
                    // 上面已经比较过了
                    continue;
                }
                return false;
            }
        }
        return true;
    }

    
    public static Utf8ArrayToStr(array: Uint8Array): string {
        let out, i, len, c;
        let char2, char3;
    
        out = "";
        len = array.length;
        i = 0;
        while(i < len) {
            c = array[i++];
            switch(c >> 4)
            { 
              case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
              case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
              case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                               ((char2 & 0x3F) << 6) |
                               ((char3 & 0x3F) << 0));
                break;
            }
        }
    
        return out;
    }

    static gamelogic: {[index:string]: string} = {};
    public static GetGameLogic_String(key:string){
        return String(this.gamelogic.gamelogic[key]);
    }

    public static GetGameLogic_Num(key:string){
        return Number(this.gamelogic.gamelogic[key]);
    }

    public static easeInCubic(t, b, c, d)
    {
        return c * ((t=t/d) * t * t) + b;
    }

    public static easeOutCubic(t, b, c, d)
    {
        return c * ((t=t/d - 1) * t * t + 1) + b;
    }

    public static easeInOutCubic(t, b, c, d)
    {
        t = 2 * t / d;
        if(t < 1)
        {
            return c * 0.5 * t * t * t + b;
        }

        return c * 0.5 * ((t=t-2) * t * t + 2) + b;
    }

    public static easeInQuart(t, b, c, d)
    {
        return c * ((t=t/d) * t * t * t) + b;
    }

    public static easeOutQuart(t, b, c, d)
    {
        return -c * ((t=t/d - 1) * t * t * t - 1) + b;
    }

    public static easeInOutQuart(t, b, c, d)
    {
        t = 2 * t / d;
        if(t < 1)
        {
            return 0.5 * c * t * t * t * t + b;
        }

        return -c * 0.5 *((t=t-2) * t * t * t - 2) + b;
    }

    public static easeInExpo(t, b, c, d)
    {
        return t == 0 ? b : (c * Math.pow(2, 10 *(t/d -1)) + b);
    }

    public static easeOutExpo(t, b, c, d)
    {
        return (t == d) ? (b + c) : (c * (-Math.pow(2, -10 * t / d) + 1) + b);
    }

    public static easeInOutExpo(t, b, c, d)
    {
        if(t==0) return b;
        if(t==d) return b + c;

        t = 2 * t / d;
        if(t < 1) return c * 0.5 * Math.pow(2, 10 * (t-1)) + b;
        return c * 0.5 * (-Math.pow(2, -10 * (t-1)) + 2) + b;
    }

    public static easeInSine(t, b, c, d)
    {
        return b + c *( 1 - Math.cos( t / d * Math.PI * 0.5));
    }

    public static easeOutSine(t, b, c, d)
    {
        return b + c * Math.sin( t / d * Math.PI * 0.5);
    }

    public static easeInOutSine(t, b, c, d)
    {
        return c * 0.5 * (1 - Math.cos(Math.PI * t / d)) + b;
    }

    public static easeLiner(t, b, c, d)
    {
        return b + c * t / d;
    }

    public static clock(time, fmt = "hh:mm:ss"){
        let h = Math.floor(time / (60 * 60));
        let hRemain = time % (60 * 60);
        let m = Math.floor(hRemain / 60);
        let mRemain = hRemain % 60;
        let s = mRemain;
    
        let obj = {
            "h+": ('00' + h).substr(-2),
            "m+": ('00' + m).substr(-2),
            "s+": ('00' + s).substr(-2),
        }
    
        for (let key in obj) {
            let pat = `(${key})`
            if (new RegExp(pat).test(fmt)) {
                let str = obj[key] + '';
                // RegExp.$1 hh mm ss贪婪匹配
                fmt = fmt.replace(RegExp.$1, str)
            }
        }
        return fmt;
    }

    public static Format123ToABC(num:number, digits:number):string{
        let ordA = 'A'.charCodeAt(0);
        let ordZ = 'Z'.charCodeAt(0);
        let len = ordZ - ordA + 1;
        let s = "";
        if(num == 0) s = 'A';
        while( num > 0 ) {
            s = String.fromCharCode(num % len + ordA) + s;
            num = Math.floor(num / len);
        }
        if(s.length > digits){
            
        }else{
            let off = digits-s.length;
            for(let i = 0; i < off; i++){
                s = 'A' + s;
            }
        }
        return s;
    }

    public static FormatABCTo123(str:string):number{
        let num = 0;
        let ordA = 'A'.charCodeAt(0);
        for(let i = 0; i < str.length; i++){
            let ord = str[i].charCodeAt(0)-ordA;
            num += ord*Math.pow(26, str.length-i-1)
        }
        return num;
    }

    public static FormatABCDigits(str:string, digits:number):string{
        str = str.toUpperCase();
        if(str.length > digits){
            return "";
        }
        let t = str;
        for(let i = 0; i < digits-str.length; i++){
            t = 'A' + t;
        }
        return t;
    }
}

export class EventMgr extends Singleton
{
	private tabEvent: Map<string, Handler[]> = new Map<string,Handler[]>();
    
    bActive:boolean = true;

    private dispatchEvents: Array<any> = [];
    private removeEvents: Array<any> = [];

    Reset(){
        this.tabEvent.clear();
    
        this.bActive = true;

    }
    
	AddEvent(strEvent:string, cb:Handler): number
	{
        let arr = this.tabEvent.get(strEvent);
        if(!arr){
            this.tabEvent.set(strEvent,[cb]);
        }else{
            arr.push(cb);
        }
        return cb.id;
	}

    private inProcess():boolean
    {
        return this.dispatchEvents.length > 0;
    }

    private clearEvent(strEvent:string, id?:number)
    {
        if(!id)
        {
            let arr:Handler[] = this.tabEvent.get(strEvent);
            if(arr)
            {
                for(let h of arr)
                {
                    h.recover();
                }
                this.tabEvent.delete(strEvent);
            }
        }
        else 
        {
            let arr:Handler[] = this.tabEvent.get(strEvent);
            if(arr)
            {
                for(let i = arr.length - 1; i > -1; i--)
                {
                    if(arr[i].id == id || arr[i].id == 0)
                    {
                        arr[i].recover();
                        arr.splice(i, 1);
                    }
                }
    
                if(arr && arr.length == 0) this.tabEvent.delete(strEvent);
            }
        }
    }

    private cleanRemoveEvents()
    {
        if(!this.inProcess())
        {
            this.Clean();
        }
    }

    Clean()
    {
        if(this.inProcess()) return;

        for(let i = 0; i < this.removeEvents.length; ++i)
        {
            let item = this.removeEvents[i];
            if(item[0] == "") 
            {
                continue;
            }
            else
            {
                let strEvent = item[0];
                let id = item[1];
                this.clearEvent(strEvent, id);
            }
        }

        this.removeEvents = [];

        let evts = Array.from(this.tabEvent.keys());
        for(let i = 0; i < evts.length; ++i)
        {
            let handler_arr = this.tabEvent.get(evts[i]);
            if(handler_arr)
            {
                for(let a = handler_arr.length - 1; a > -1; a--)
                {
                    if(handler_arr[a].id == 0) handler_arr.splice(a, 1);
                }

                if(handler_arr.length == 0) this.tabEvent.delete(evts[i]);
            }
        }
    }
	
	RemoveEvent(strEvent:string, id?:number): void
	{
        if(this.inProcess())
        {
            this.removeEvents.push([strEvent, id]);            
        }
        else
        {
            this.clearEvent(strEvent, id);
        }
	}
	
	RemoveAllEvent():void
	{
        if(this.inProcess())
        {
            this.removeEvents.push(["", undefined]);
        }
        else
        {
            this.tabEvent.forEach((v, k, m) => {
                for(let h of v)
                {
                    h.recover();
                }
            });

            this.tabEvent.clear();
        }
	}
	
	DispatchEvent(strEvent,...args)
	{
		if(!this.bActive){
            return;
        }
		let arrEvent = this.tabEvent.get(strEvent)
		if(!arrEvent)
		{
			return;
		}
        
        let inRemoveList = this.removeEvents.filter(v => v[0] == strEvent).length > 0;
        if(inRemoveList){
            //已经在删除队列中 防止递归    
            return;
        }

        this.dispatchEvents.push(strEvent);
        //TODO unpack params
        for(let i = 0; i < arrEvent.length; ++i)
        {
            if(arrEvent[i].id > 0) arrEvent[i].runWith(args);
        }

        // for(let i = arrEvent.length - 1; i > -1; i--)
        // {
        //     if(arrEvent[i].id == 0) arrEvent.splice(i, 1);
        // }

        // if(arrEvent.length == 0) this.tabEvent.delete(strEvent);

        this.tabEvent.forEach((v,k,m)=>{
            if(k.indexOf(strEvent+"#") != -1){
                for(let i = 0; i < v.length; ++i)
                {
                    if(v[i].id > 0) v[i].runWith(args);
                    // if(v[i].id == 0)
                    // {
                    //     v.splice(i, 1); i--;
                    // }
                }
            }
        })

        this.dispatchEvents.pop();

        this.cleanRemoveEvents();
	}
}


export class Handler {
    once: boolean;
    _id: number;
    static _gid: number = 1;
    caller: any;
    method: any;
    args: any;
    static _pool: any;
    
    constructor(caller = null, method = null, args = null, once = false) {
        this.once = false;
        this._id = 0;
        this.setTo(caller, method, args, once);
    }

    get id():number
    {
        return this._id;
    }

    setTo(caller, method, args, once = false) {
        this._id = Handler._gid++;
        if(this._id < 0)
        {
            //! 超出了number的边界，几乎不可能
            this._id = 1;
            Handler._gid = 1;
        }
        this.caller = caller;
        this.method = method;
        this.args = args;
        this.once = once;
        return this;
    }
    run() {
        if (this.method == null)
            return null;
        var id = this._id;
        var result = this.method.apply(this.caller, this.args);
        this._id === id && this.once && this.recover();
        return result;
    }
    runWith(data) {
        if (this.method == null)
            return null;
        var id = this._id;
        if (data == null)
            var result = this.method.apply(this.caller, this.args);
        else if (!this.args && !data.unshift)
            result = this.method.call(this.caller, data);
        else if (this.args)
            result = this.method.apply(this.caller, this.args.concat(data));
        else
            result = this.method.apply(this.caller, data);
        this._id === id && this.once && this.recover();
        return result;
    }
    clear() {
        this.caller = null;
        this.method = null;
        this.args = null;
        return this;
    }
    recover() {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }
    static create(caller, method, args = null, once = true) {
        if (Handler._pool.length)
            return Handler._pool.pop().setTo(caller, method, args, once);
        return new Handler(caller, method, args, once);
    }
}
Handler._pool = [];
Handler._gid = 1;