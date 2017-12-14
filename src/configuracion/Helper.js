import { Config } from './';
import moment from 'moment';
import 'moment/locale/es';

const { texts, colors } = Config;

class Helper {

    static getDateISO(year, month, day) {
        return year.toString() + '-' + 
                ('00' + (month + 1).toString()).slice(-2) + '-' + 
                ('00' + (day).toString()).slice(-2);
    }   

    static getDateISOfromDate(date) {
        return date.getFullYear().toString() + '-' + 
                ('00' + (date.getMonth() + 1).toString()).slice(-2) + '-' + 
                ('00' + (date.getDate()).toString()).slice(-2);
    }   

    static toDateM(date) {
        if(!moment(date).isValid()){
            return null;
        }

        if(moment(date).year() > 2100){
            return null;
        }

        return moment(date);        
    }

    static toDate(dateString) {
        if (dateString) {
            return new Date(parseInt(dateString.substring(0, 4)),
                            parseInt(dateString.substring(5, 7)) - 1,
                            parseInt(dateString.substring(8, 10)));
        }

        return null;
    }

	static getDayOfWeek(date) {
		return texts.days[date.getDay()];
	}
	
	static getDifference(date1, date2) {
		return date1 - date2;
    }       

    static prettyfyDate(uglyDate) {
        if (uglyDate === undefined || uglyDate === null || uglyDate === 'null' || uglyDate === '') {
            return {
                color: colors.main,
                date: '',
                datetime: ''
            };
        }
    
        const date = this.toDate(uglyDate);
        const realDate = new Date(uglyDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const diff = this.getDifference(date, today) / (3600 * 24 * 1000);
        const time =  ' ' + ('00' + realDate.getHours().toString()).slice(-2) + ':' + ('00' + realDate.getMinutes().toString()).slice(-2) /*+ ':' + realDate.getSeconds().toString()*/
    
        if(diff > 3600) {
            return { color: colors.lightText, date: 'Sin fecha', datetime: 'Sin fecha'}
        }

        if (diff === 0) {
            return { color: colors.main, date: 'Hoy', datetime: 'Hoy' + time };
        } else if (diff === 1) {
            return { color: colors.main, date: 'Mañana', datetime: 'Mañana' + time };
        } else if (diff === -1) {
            return { color: colors.error, date: 'Ayer', datetime: 'Ayer' + time };
        } else if (diff > -6 && diff < 6) {
            return { color: (diff > 0) ? colors.main : colors.error, date: this.getDayOfWeek(date), datetime: this.getDayOfWeek(date) + time };		
        } 
    
        return {
                    color: (diff > 0) ? colors.main : colors.error, 
                    date: date.getDate().toString() + ' ' + texts.month[date.getMonth()] + ((date.getYear() !== today.getYear()) ? (', ' + date.getFullYear().toString()) : ''),
                    datetime: date.getDate().toString() + ' ' + texts.month[date.getMonth()] + ((date.getYear() !== today.getYear()) ? (', ' + date.getFullYear().toString()) : '') + time
                };		
    }

    static clrHtml(str){
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />').replace(/(?:\t)/g, '&nsbp;');
    }

    static htmlEncode(str) {
        return str
            .replace("&amp;", '&')
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", '"')
            .replace("&#039;", "'");           
    }

    static htmlDecode(str) {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&nsbp;/g, " ");           
    }    

    static htmlPaso(str){
        try{
            if(str !== undefined && str !== null){
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
            else{
                return "";
            }
        }
        catch(err){
            console.log(err);
            return "";
        }

    }    

    static decode_utf8(s) {
        try{
            var newstr = decodeURIComponent(escape(s));
            return newstr;      
        }
        catch(err){
            return s;
        }
        // return s;
    }    

    

}

export { Helper };