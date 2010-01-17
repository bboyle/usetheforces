/*
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
*/
typeof jQuery!="undefined"&&function(a){var b=a.forces=a.forces||{},e="January February March April May June July August September October November December".split(/ /),g="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(/ /),c=new Date,f=function(d,h,k){for(d=String(d);d.length<h;)d=String(k)+d;return d};b.dateFormat=function(d,h){if(!d)return"";if(!h)return d.toString();return h.replace(/YYYY|yyyy|%Y/,d.getFullYear()).replace(/MM|%m/,f(d.getMonth()+1,2,"0")).replace(/dd|%d/,f(d.getDate(),
2,"0")).replace(/%e/,f(d.getDate(),2," ")).replace(/d/,d.getDate()).replace(/%B/,e[d.getMonth()]).replace(/%A/,g[d.getDay()])};b.dateParse=function(d,h,k){function l(n,p){i[n]=i[n]||p}d=d.split(/[^A-Za-z0-9]/);for(var m=h||k||c,i={},j=0;j<d.length;j++)if(d[j].match(/^\d{4}$/))l("year",d[j]);else if(d[j].match(/^\d{1,2}$/)){var o=i.date?i.month?"year":"month":"date";if(o=="year"&&!i.year){d[j]=(m.getFullYear()+"").substring(0,2)+f(d[j],2,"0");if(h&&h.getFullYear()>d[j])d[j]+=100;else if(k&&k.getFullYear()<
d[j])d[j]-=100;else if(!h&&!k&&d[j]>m.getFullYear()+20)d[j]-=100}l(o,d[j])}if(i.date&&i.month&&i.year){d=new Date(i.year,i.month-1,i.date);if(b.dateEquals(d,i.year,i.month,i.date))return d}return null};b.dateCalc=function(d,h){h=a.extend({year:0,month:0,date:0},h);return new Date(d.getFullYear()+h.year,d.getMonth()+h.month,d.getDate()+h.date)};b.dateEquals=function(d,h,k,l){return d.getMonth()==k-1&&d.getDate()==l&&d.getFullYear()==h};b.dateEndOfMonth=function(d){d=new Date(d.getFullYear(),d.getMonth(),
31);if(d.getDate()!=31){d.setDate(31-d.getDate());d=this.dateCalc(d,{month:-1})}return d};b.DATE_TODAY=function(){return new Date(c.getFullYear(),c.getMonth(),c.getDate())};b.WEEKDAYS=function(){return g.slice()}}(jQuery);typeof jQuery!="undefined"&&function(a){var b=0;(a.forces=a.forces||{}).generateId=function(){return"tf-ID-"+ ++b}}(jQuery);
typeof jQuery!="undefined"&&function(a){var b=a.forces=a.forces||{};a.fn.forces_id=function(e){var g=a(this);if(!e||document.getElementById(e))e=b.generateId();return g.attr("id")||g.attr("id",e).attr("id")}}(jQuery);
typeof jQuery!="undefined"&&function(a){a.forces=a.forces||{};a.fn.scrollTo=function(b){b=a.extend({hash:false,focus:false,distance:1},b);var e=a(this).eq(0);if(b.hash===true)location.hash=e.forces_id();else if(typeof b.hash==="object")location.hash=b.hash.forces_id();if(b.focus===true)e.focus();else typeof b.focus=="object"&&b.focus.focus();if(b.ancestor)e=e.closest(b.ancestor);a("html,body").animate({scrollTop:e.offset().top-b.distance},100);return a(this)};a.fn.shake=function(b){b=a.extend({interval:75,
distance:10,shakes:2},b);for(var e=a(this),g=parseInt(e.css("marginLeft"))||0,c=parseInt(e.css("marginRight"))||0,f=0;f<b.shakes;f++)e.animate({marginLeft:g-b.distance,marginRight:c+b.distance},b.interval).animate({marginLeft:g+b.distance,marginRight:c-b.distance},b.interval);return e.animate({marginLeft:g,marginRight:c},b.interval)}}(jQuery);
typeof jQuery!="undefined"&&function(a){var b=a.forces=a.extend(a.forces||{},{EVENT_XF_DISABLED:"-xf-disabled",EVENT_XF_ENABLED:"-xf-enabled",EVENT_XF_FOCUS_IN:"-xf-focus-in",EVENT_XF_FOCUS_OUT:"-xf-focus-out",EVENT_XF_OPTIONAL:"-xf-optional",EVENT_XF_REQUIRED:"-xf-required",EVENT_XF_VALID:"-xf-valid",EVENT_XF_INVALID:"-xf-invalid",EVENT_XF_VALUE_CHANGED:"-xf-value-changed",EVENT_XF_SUBMIT_DONE:"-xf-submit-done",EVENT_XF_SUBMIT_ERROR:"-xf-submit-error",EVENT_TF_SUBMIT_SUPPRESSED:"-tf-submit-suppressed",
EXPR_HTML_CONTROLS:":text,select,textarea,.xf-select1 fieldset",REXP_EMAIL:/^[A-Za-z!#$%&'*+-\/=?^_`{|}~\.]+@[A-Za-z0-9-]*[A-Za-z0-9]+(?:\.[A-Za-z0-9-]*[A-Za-z0-9]+)+$/,REXP_NUMBER:/^[0-9]+$/,SUBMIT_TOLERANCE:1E4});a.extend(a.expr[":"],{"-tf-not-validated":function(c){return(a(c).data("-tf-FLAGS")&48)==0},"-xf-empty":function(c){return a.trim(a(c).forces_val()).length==0},"-xf-non-empty":function(c){return a.trim(a(c).forces_val()).length>0},"-xf-invalid":function(c){return(a(c).data("-tf-FLAGS")&
32)==32},"-xf-irrelevant":function(c){return(a(c).data("-tf-FLAGS")&1)==1},"-xf-optional":function(c){return(a(c).data("-tf-FLAGS")&4)==0},"-xf-relevant":function(c){return(a(c).data("-tf-FLAGS")&1)==0},"-xf-required":function(c){return(a(c).data("-tf-FLAGS")&4)==4},"-xf-valid":function(c){return(a(c).data("-tf-FLAGS")&16)==16}});a.fn.forces_attr=function(c,f){if(typeof f=="undefined")return(f=this.data("-tf-@"+c))?f:this.is(":-xf-"+c)?c:null;switch(c){case "relevant":this.forces__flags(2,f!==true&&
f!="relevant");break;case "required":this.forces__flags(8,f===true||f=="required");break;case "type":break;default:return this}return this.data("-tf-@"+c,f===true?c:f).forces_recalculate()};a.fn.forces_removeAttr=function(c){switch(c){case "relevant":this.forces__flags(2,false);break;case "required":this.forces__flags(8,false);break;case "type":break;default:return this}return this.removeData("-tf-@"+c).forces_recalculate()};a.fn.forces_val=function(){var c=a(this);return c.val()||c.find(":checked").val()||
null};a.fn.forces_setCustomValidity=function(c){return a(this).data("-tf-CUSTOM-VALIDITY",c)};a.fn.forces_validationMessage=function(){return a(this).data("-tf-CUSTOM-VALIDITY")||""};a.fn.forces_isConfirmationFor=function(c){var f=a(this);if(c){c=a(c);return f.data("-tf-CONFIRMS",c.data("-tf-VALIDATE",f))}else return f.data("-tf-CONFIRMS")};a.fn.forces_recalculate=function(){var c,f,d=function(h,k,l,m){h.forces__flags(k,l).trigger(m)};return this.each(function(){c=a(this);f=c.data("-tf-FLAGS")||0;
switch(f&3){case 2:d(c,1,true,b.EVENT_XF_DISABLED);break;case 1:d(c,1,false,b.EVENT_XF_ENABLED);break}switch(f&12){case 8:d(c,4,true,b.EVENT_XF_REQUIRED);break;case 4:d(c,4,false,b.EVENT_XF_OPTIONAL);break}})};a.fn.forces_validate=function(){return a(this).filter(function(){var c=a(this),f=c.data("-tf-CUSTOM-VALIDITY")?false:true,d=a.trim(c.forces_val());if(f&&d){switch(c.forces_attr("type")){case "email":f=b.REXP_EMAIL.exec(d);break;case "date":f=b.dateParse(d);break;case "number":f=b.REXP_NUMBER.exec(d);
break}var h=c.forces_isConfirmationFor();if(h)f=a.trim(h.val())==d}else if(c.is(":-xf-required"))f=false;f?c.forces__flags(32,false).forces__flags(16,true).trigger(b.EVENT_XF_VALID):c.forces__flags(16,false).forces__flags(32,true).trigger(b.EVENT_XF_INVALID);return!f})};a.fn.forces__flags=function(c,f){var d;this.set=function(){d=a(this);d.data("-tf-FLAGS",d.data("-tf-FLAGS")|c)};this.unset=function(){d=a(this);d.data("-tf-FLAGS",d.data("-tf-FLAGS")&~c)};return f?this.each(this.set):this.each(this.unset)};
var e=function(c){var f=a(this);if(f.data("-tf-submitted")&&c.timeStamp-f.data("-tf-submitted")<b.SUBMIT_TOLERANCE){c.stopImmediatePropagation();f.trigger(b.EVENT_TF_SUBMIT_SUPPRESSED);return false}f.data("-tf-submitted",c.timeStamp);c=f.find("fieldset:-xf-irrelevant").find(b.EXPR_HTML_CONTROLS);if(f.find(b.EXPR_HTML_CONTROLS).filter(":-xf-relevant").not(c).forces_validate().length){f.trigger(b.EVENT_XF_SUBMIT_ERROR);f.removeData("-tf-submitted");return false}f.trigger(b.EVENT_XF_SUBMIT_DONE);return true},
g=function(c){var f=a(c.target);switch(c.type){case "click":case "focus":case "mousedown":f.data("-tf-VALUE",f.val()).trigger(b.EVENT_XF_FOCUS_IN);break;case "blur":c=f.data("-tf-VALUE");f.removeData("-tf-VALUE").trigger(b.EVENT_XF_FOCUS_OUT);f.val()!==c&&f.trigger(b.EVENT_XF_VALUE_CHANGED).add(a(f.data("-tf-VALIDATE")).not(":-tf-not-validated:-xf-empty")).forces_validate();break}};a.fn.forces_enable=function(c){b.toggleFormHandlers(c,a(this))};b.toggleFormHandlers=function(c,f){f=f||a("form");if(c||
c===undefined){f.bind("submit",e);a("input,select,textarea",f).bind("focus blur click mousedown",g)}else{f.unbind("submit",e);a("input,select,textarea",f).unbind("focus blur click mousedown",g)}}}(jQuery);
typeof jQuery!="undefined"&&function(a){var b=a.forces=a.extend(a.forces||{},{CSS_ACTIVE:"tf-active",CSS_ALERT:"xf-alert",CSS_HINT:"xf-hint",CSS_INVALID:"xf-invalid",CSS_MISSING:"tf-missing",CSS_REQUIRED:"xf-required",CSS_SUBMIT_DONE:"xf-submit-done",CSS_SUBMIT_ERROR:"xf-submit-error",CSS_VALID:"xf-valid",MSG_INVALID:"is invalid",MSG_INVALID_DATE:"unrecognised date format",MSG_INVALID_EMAIL:"must contain an email address",MSG_INVALID_CONFIRM:"doesn't match ",MSG_INVALID_NUMBER:"must contain only digits",
MSG_MISSING:"must be completed",MSG_SUBMIT_ERROR:"Unable to process this form",HTML_ALERT_INLINE:function(e){return a("<em></em>").addClass(this.CSS_ALERT).text(e)},HTML_HINT_INLINE:function(e){return a('<small class="xf-hint"></small>').addClass(this.CSS_HINT).text(e)},HTML_REQUIRED:function(){return a(document.createElement("abbr")).addClass(this.CSS_REQUIRED).attr("title","required").text("*")},HTML_STATUS:function(){return a('<div class="tf-status"><div class="tf-alert inner"><h1>'+this.MSG_SUBMIT_ERROR+
"</h1><ol></ol></div></div>")},HTML_STATUS_ID:"tf-status-alert",MS_ENABLE:300,MS_DISABLE:0});a.extend(a.expr[":"],{"-tf-form":function(e){return a(e).is(".tf-form")},"-xf-control":function(e){return a(e).is(".xf-input,.xf-select,.xf-select1,.xf-textarea")},"-xf-group":function(e){return a(e).is(".xf-group")},"-xf-label":function(e){return a(e).is(".xf-label")}});a.fn.forces_alert=function(e){var g=a(this),c=g.closest(":-xf-control");c.find(".xf-alert").remove();e&&c.map(function(){var f=a(this).children("fieldset");
return f.length==1?f.get(0):this}).append(b.HTML_ALERT_INLINE(e));return g};a.fn.forces_hint=function(e){var g=a(this),c=g.closest(":-xf-control");c.find(".xf-hint").remove();e&&c.find(".xf-label").parent().append(b.HTML_HINT_INLINE(e));return g};b.HTML_CALENDAR=function(e){e=a.extend({date:b.DATE_TODAY()},e);var g=a('<table class="tf-calendar"><caption>'+b.dateFormat(e.date,"%B %Y")+"</caption><thead><tr></tr></thead><tbody></tbody></table>").data("-tf-date-seed",new Date(e.date.getTime())),c=new Date(e.date.getTime());
c.setDate(1);c=c.getDay();var f="<tr>"+(c>0?'<td colspan="'+c+'"></td>':"")+"<td>1</td>",d=b.dateEndOfMonth(e.date);for(e=2;e<d.getDate();e++){if((c+e)%7==1)f+="</tr><tr>";f+="<td>"+e+"</td>"}switch(d.getDay()){case 6:f+="<td>"+d.getDate()+"</td>";break;case 5:f+="<td>"+d.getDate()+"</td><td></td>";break;case 0:f+="</tr><tr>";default:f+="<td>"+d.getDate()+'</td><td colspan="'+(6-d.getDay())+'"></td>'}g.find("tbody").html(f+"</tr>");c=b.WEEKDAYS();for(e=0;e<7;e++)g.find("thead tr").append('<th scope="col" title="'+
c[e]+'">'+c[e].substr(0,1)+"</th>");return g};a(":-xf-control").live(b.EVENT_XF_REQUIRED,function(){a(this).find(".xf-required").remove().end().find(":-xf-label").after(b.HTML_REQUIRED())}).live(b.EVENT_XF_OPTIONAL,function(){a(this).removeClass(b.CSS_MISSING).find(".xf-required").remove()}).live(b.EVENT_XF_VALID,function(){a(this).forces_alert().removeClass(b.CSS_INVALID).addClass(b.CSS_VALID)}).live(b.EVENT_XF_INVALID,function(){var e=a(this),g=e.find("fieldset,input,select,textarea").forces_validationMessage();
if(!g)switch(e.find(":text").forces_attr("type")){case "email":g=b.MSG_INVALID_EMAIL;break;case "date":g=b.MSG_INVALID_DATE;break;case "number":g=b.MSG_INVALID_NUMBER;break;default:g=e.find("input,select,textarea");var c=g.forces_isConfirmationFor();g=c?b.MSG_INVALID_CONFIRM+c.closest(":-xf-control").find(":-xf-label").text().replace(/[?: ]*$/,""):g.is(":-xf-empty")?b.MSG_MISSING:"invalid"}e.removeClass(b.CSS_VALID).addClass(b.CSS_INVALID).forces_alert(g)}).live(b.EVENT_XF_FOCUS_IN,function(){var e=
a(this),g=e.closest(":-xf-group");e.closest("form").find("."+b.CSS_ACTIVE).not(e,g).removeClass(b.CSS_ACTIVE);e.add(g).addClass(b.CSS_ACTIVE)});a(":-xf-control, :-xf-group, .section").live(b.EVENT_XF_ENABLED,function(){a(this).find(b.EXPR_HTML_CONTROLS).each(function(){this.removeAttribute("disabled")}).end().stop(true,true).slideDown(b.MS_ENABLE)}).live(b.EVENT_XF_DISABLED,function(){a(this).find(b.EXPR_HTML_CONTROLS).each(function(){this.setAttribute("disabled","disabled")}).end().stop(true,true).hide(b.MS_DISABLE)});
a(":-tf-form").live(b.EVENT_XF_SUBMIT_ERROR,function(){var e=a(this),g=e.find(b.EXPR_HTML_CONTROLS),c=e.data("-tfui-status");if(!c){c=e.data("-tfui-status",b.HTML_STATUS()).data("-tfui-status");e.find(".tf-status > .tf-alert").parent().remove()}var f=a("<ol></ol>"),d;g.filter(":-xf-invalid").each(function(){var h=a(this),k=h.forces_isConfirmationFor();if(!(d=h.forces_validationMessage()))if(h.is(":-xf-empty"))d=b.MSG_MISSING;else if(k)d=b.MSG_INVALID_CONFIRM+k.closest(":-xf-control").find(":-xf-label").text().replace(/[?: ]*$/,
"");else switch(h.forces_attr("type")){case "date":d=b.MSG_INVALID_DATE;break;case "email":d=b.MSG_INVALID_EMAIL;break;case "number":d=b.MSG_INVALID_NUMBER;break}h=a('<a href="#'+h.forces_id()+'">'+h.closest(":-xf-control").find(":-xf-label").text().replace(/[?:]*$/,": ")+d+"</a>");f.append(a("<li></li>").append(h));d=b.MSG_INVALID});e.addClass(b.CSS_SUBMIT_ERROR).before(c.find("ol").replaceWith(f).end().fadeIn(300));c.forces_id(this.HTML_STATUS_ID);c.scrollTo({hash:true,focus:true});g.filter(":-xf-required:not(:-xf-empty,:-xf-invalid)").forces_alert();
g.filter(":-xf-required:not(:-xf-empty)").closest(":-xf-control").removeClass(b.CSS_MISSING);g.filter(":-xf-required:-xf-empty").closest(":-xf-control").addClass(b.CSS_MISSING).forces_alert(b.MSG_MISSING)}).live(b.EVENT_TF_SUBMIT_SUPPRESSED,function(){a(this).find(":submit").shake({interval:75,distance:4,shakes:2})}).live(b.EVENT_XF_SUBMIT_DONE,function(){var e=a(this);e.data("-tfui-status")&&e.data("-tfui-status").remove();e.removeClass(b.CSS_SUBMIT_ERROR).addClass(b.CSS_SUBMIT_DONE)});a(".tf-alert a").live("click",
function(){var e=a(this).attr("href");if(e.indexOf("#")<0)return true;a(e.substring(e.indexOf("#"))).scrollTo({ancestor:":-xf-control",hash:true,focus:true});return false});a(".usetheforces").forces_enable(true);a(".xf-required").closest(":-xf-control").find(b.EXPR_HTML_CONTROLS).forces_attr("required",true)}(jQuery);
