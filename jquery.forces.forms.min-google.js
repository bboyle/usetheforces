/*
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
*/
typeof jQuery!="undefined"&&function(b){var c=b.forces=b.forces||{},e="January February March April May June July August September October November December".split(/ /),g="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(/ /),h=new Date,d=function(a,f,j){for(a=String(a);a.length<f;)a=String(j)+a;return a};c.dateFormat=function(a,f){if(!a)return"";if(!f)return a.toString();return f.replace(/YYYY|yyyy|%Y/,a.getFullYear()).replace(/MM|%m/,d(a.getMonth()+1,2,"0")).replace(/dd|%d/,d(a.getDate(),
2,"0")).replace(/%e/,d(a.getDate(),2," ")).replace(/d/,a.getDate()).replace(/%B/,e[a.getMonth()]).replace(/%A/,g[a.getDay()])};c.dateParse=function(a,f,j){function l(n,p){i[n]=i[n]||p}a=a.split(/[^A-Za-z0-9]/);for(var m=f||j||h,i={},k=0;k<a.length;k++)if(a[k].match(/^\d{4}$/))l("year",a[k]);else if(a[k].match(/^\d{1,2}$/)){var o=i.date?i.month?"year":"month":"date";if(o=="year"&&!i.year){a[k]=(m.getFullYear()+"").substring(0,2)+d(a[k],2,"0");if(f&&f.getFullYear()>a[k])a[k]+=100;else if(j&&j.getFullYear()<
a[k])a[k]-=100;else if(!f&&!j&&a[k]>m.getFullYear()+20)a[k]-=100}l(o,a[k])}if(i.date&&i.month&&i.year){a=new Date(i.year,i.month-1,i.date);if(c.dateEquals(a,i.year,i.month,i.date))return a}return null};c.dateCalc=function(a,f){f=b.extend({year:0,month:0,date:0},f);return new Date(a.getFullYear()+f.year,a.getMonth()+f.month,a.getDate()+f.date)};c.dateEquals=function(a,f,j,l){return a.getMonth()==j-1&&a.getDate()==l&&a.getFullYear()==f};c.dateEndOfMonth=function(a){a=new Date(a.getFullYear(),a.getMonth(),
31);if(a.getDate()!=31){a.setDate(31-a.getDate());a=this.dateCalc(a,{month:-1})}return a};c.DATE_TODAY=function(){return new Date(h.getFullYear(),h.getMonth(),h.getDate())};c.WEEKDAYS=function(){return g.slice()}}(jQuery);typeof jQuery!="undefined"&&function(b){var c=0;(b.forces=b.forces||{}).generateId=function(){return"tf-ID-"+ ++c}}(jQuery);
typeof jQuery!="undefined"&&function(b){var c=b.forces=b.forces||{};b.fn.forces_id=function(e){var g=b(this);if(!e||document.getElementById(e))e=c.generateId();return g.attr("id")||g.attr("id",e).attr("id")}}(jQuery);
typeof jQuery!="undefined"&&function(b){b.forces=b.forces||{};b.fn.scrollTo=function(c){c=b.extend({hash:false,focus:false,distance:1},c);var e=b(this).eq(0);if(c.hash===true)location.hash=e.forces_id();else if(typeof c.hash==="object")location.hash=c.hash.forces_id();if(c.focus===true)e.focus();else typeof c.focus=="object"&&c.focus.focus();if(c.ancestor)e=e.closest(c.ancestor);b("html,body").animate({scrollTop:e.offset().top-c.distance},100);return b(this)};b.fn.shake=function(c){c=b.extend({interval:75,
distance:10,shakes:2},c);for(var e=b(this),g=parseInt(e.css("marginLeft"))||0,h=parseInt(e.css("marginRight"))||0,d=0;d<c.shakes;d++)e.animate({marginLeft:g-c.distance,marginRight:h+c.distance},c.interval).animate({marginLeft:g+c.distance,marginRight:h-c.distance},c.interval);return e.animate({marginLeft:g,marginRight:h},c.interval)}}(jQuery);
typeof jQuery!="undefined"&&function(b){var c=b.forces=b.extend(b.forces||{},{EVENT_XF_DISABLED:"-xf-disabled",EVENT_XF_ENABLED:"-xf-enabled",EVENT_XF_FOCUS_IN:"-xf-focus-in",EVENT_XF_FOCUS_OUT:"-xf-focus-out",EVENT_XF_OPTIONAL:"-xf-optional",EVENT_XF_REQUIRED:"-xf-required",EVENT_XF_VALID:"-xf-valid",EVENT_XF_INVALID:"-xf-invalid",EVENT_XF_VALUE_CHANGED:"-xf-value-changed",EVENT_XF_SUBMIT_DONE:"-xf-submit-done",EVENT_XF_SUBMIT_ERROR:"-xf-submit-error",EVENT_TF_SUBMIT_SUPPRESSED:"-tf-submit-suppressed",
EXPR_HTML_CONTROLS:":text,select,textarea,.xf-select>fieldset,.xf-select1>fieldset",REXP_EMAIL:/^[A-Za-z0-9!#$%&'*+-\/=?^_`{|}~\.]+@[A-Za-z0-9-]*[A-Za-z0-9]+(?:\.[A-Za-z0-9-]*[A-Za-z0-9]+)+$/,REXP_NUMBER:/^[0-9]+$/,SUBMIT_TOLERANCE:1E4});b.extend(b.expr[":"],{"-tf-not-validated":function(d){return(b(d).data("-tf-FLAGS")&48)==0},"-tf-validated":function(d){return(b(d).data("-tf-FLAGS")&48)!=0},"-xf-empty":function(d){return b.trim(b(d).forces_val()).length==0},"-xf-non-empty":function(d){return b.trim(b(d).forces_val()).length>
0},"-xf-invalid":function(d){return(b(d).data("-tf-FLAGS")&32)==32},"-xf-irrelevant":function(d){return(b(d).data("-tf-FLAGS")&1)==1},"-xf-optional":function(d){return(b(d).data("-tf-FLAGS")&4)==0},"-xf-relevant":function(d){return(b(d).data("-tf-FLAGS")&1)==0},"-xf-required":function(d){return(b(d).data("-tf-FLAGS")&4)==4},"-xf-valid":function(d){return(b(d).data("-tf-FLAGS")&16)==16}});b.fn.forces_attr=function(d,a){if(typeof a=="undefined"){if(a=this.data("-tf-@"+d))return a;switch(d){case "required":case "relevant":if(this.is(":-xf-"+
d))return d}return null}switch(d){case "relevant":this.forces__flags(2,a!==true&&a!="relevant");break;case "required":this.forces__flags(8,a===true||a=="required");break;case "type":break;default:return this}return this.data("-tf-@"+d,a===true?d:a).forces_recalculate()};b.fn.forces_removeAttr=function(d){switch(d){case "relevant":this.forces__flags(2,false);break;case "required":this.forces__flags(8,false);break;case "type":break;default:return this}return this.removeData("-tf-@"+d).forces_recalculate()};
b.fn.forces_val=function(){var d=b(this);return d.val()||d.find(":checked").val()||null};b.fn.forces_setCustomValidity=function(d){return b(this).data("-tf-customValidityErrorMessage",d)};b.fn.forces_validity=function(){var d=b(this);return d.data("-tf-validity")||d.data("-tf-validity",{valueMissing:false,typeMismatch:false,valid:true}).data("-tf-validity")};b.fn.forces_recalculate=function(){var d,a,f=function(j,l,m,i){j.forces__flags(l,m).trigger(i)};return this.each(function(){d=b(this);a=d.data("-tf-FLAGS")||
0;switch(a&3){case 2:f(d,1,true,c.EVENT_XF_DISABLED);break;case 1:f(d,1,false,c.EVENT_XF_ENABLED);break}switch(a&12){case 8:f(d,4,true,c.EVENT_XF_REQUIRED);break;case 4:f(d,4,false,c.EVENT_XF_OPTIONAL);break}})};b.fn.forces_validate=function(d){return b(this).filter(function(){var a=b(this),f=a.forces_validity();f.customError=!!a.data("-tf-customValidityErrorMessage");f.valueMissing=a.is(":-xf-required:-xf-empty");var j=b.trim(a.forces_val());if(j)switch(a.forces_attr("type")){case "email":f.typeMismatch=
!c.REXP_EMAIL.exec(j);break;case "date":f.typeMismatch=c.dateParse(j)==null;break;case "number":f.typeMismatch=!c.REXP_NUMBER.exec(j);break;default:f.typeMismatch=false}else f.typeMismatch=false;f.valid=!(f.valueMissing||f.customError||f.typeMismatch);f.valid?a.forces__flags(32,false).forces__flags(16,true).trigger(c.EVENT_XF_VALID):a.forces__flags(16,false).forces__flags(32,true).trigger(c.EVENT_XF_INVALID);return d===undefined||d===f.valid})};b.fn.forces__flags=function(d,a){var f;this.set=function(){f=
b(this);f.data("-tf-FLAGS",f.data("-tf-FLAGS")|d)};this.unset=function(){f=b(this);f.data("-tf-FLAGS",f.data("-tf-FLAGS")&~d)};return a?this.each(this.set):this.each(this.unset)};var e=function(d){var a=b(this);if(a.data("-tf-submitted")&&d.timeStamp-a.data("-tf-submitted")<c.SUBMIT_TOLERANCE){d.stopImmediatePropagation();a.trigger(c.EVENT_TF_SUBMIT_SUPPRESSED);return false}a.data("-tf-submitted",d.timeStamp);d=a.find("fieldset:-xf-irrelevant").find(c.EXPR_HTML_CONTROLS);if(a.find(c.EXPR_HTML_CONTROLS).filter(":-xf-relevant").not(d).forces_validate(false).length){a.trigger(c.EVENT_XF_SUBMIT_ERROR);
a.removeData("-tf-submitted");return false}a.trigger(c.EVENT_XF_SUBMIT_DONE);return true},g=function(d){var a=b(d.target);switch(d.type){case "click":case "focus":a.data("-tf-VALUE",a.val()).trigger(c.EVENT_XF_FOCUS_IN);break;case "blur":d=a.data("-tf-VALUE");a.removeData("-tf-VALUE").trigger(c.EVENT_XF_FOCUS_OUT);a.val()!==d&&a.trigger(c.EVENT_XF_VALUE_CHANGED).forces_validate();break}},h=function(d){var a=b(d.target).closest("fieldset");switch(d.type){case "focus":a.data("-tf-VALUE",a.forces_val()).trigger(c.EVENT_XF_FOCUS_IN);
break;case "click":d=a.data("-tf-VALUE");a.forces_val()!==d&&a.trigger(c.EVENT_XF_VALUE_CHANGED).forces_validate();break;case "blur":d=a.data("-tf-VALUE");a.removeData("-tf-VALUE").trigger(c.EVENT_XF_FOCUS_OUT);a.forces_val()!==d&&a.trigger(c.EVENT_XF_VALUE_CHANGED).forces_validate();break}};b.fn.forces_enable=function(d){c.toggleFormHandlers(d,b(this))};c.toggleFormHandlers=function(d,a){a=a||b("form");if(d||d===undefined){a.bind("submit",e);b(":text,select,textarea",a).bind("focus blur click",g);
b(":radio,:checkbox",a).bind("focus blur click",h)}else{a.unbind("submit",e);b(":text,select,textarea",a).unbind("focus blur click",g);b(":radio,:checkbox",a).unbind("focus blur click",h)}}}(jQuery);
typeof jQuery!="undefined"&&function(b){var c=b.forces=b.extend(b.forces||{},{CSS_ACTIVE:"tf-active",CSS_ALERT:"xf-alert",CSS_HINT:"xf-hint",CSS_INVALID:"xf-invalid",CSS_MISSING:"tf-missing",CSS_REQUIRED:"xf-required",CSS_SUBMIT_DONE:"xf-submit-done",CSS_SUBMIT_ERROR:"xf-submit-error",CSS_VALID:"xf-valid",MSG_INVALID:"is invalid",MSG_TYPE_MISMATCH:{date:"unrecognised date format",email:"must contain an email address",number:"must contain only digits"},MSG_MISSING:"must be completed",MSG_SUBMIT_ERROR:"Unable to process this form",
HTML_ALERT_INLINE:function(e){return b("<em></em>").addClass(this.CSS_ALERT).text(e)},HTML_HINT_INLINE:function(e){return b('<small class="xf-hint"></small>').addClass(this.CSS_HINT).text(e)},HTML_REQUIRED:function(){return b(document.createElement("abbr")).addClass(this.CSS_REQUIRED).attr("title","required").text("*")},HTML_STATUS:function(){return b('<div class="tf-status"><div class="tf-alert inner"><h1>'+this.MSG_SUBMIT_ERROR+"</h1><ol></ol></div></div>")},HTML_STATUS_ID:"tf-status-alert",MS_ENABLE:300,
MS_DISABLE:0});b.extend(b.expr[":"],{"-tf-form":function(e){return b(e).is(".tf-form")},"-xf-control":function(e){return b(e).is(".xf-input,.xf-select,.xf-select1,.xf-textarea")},"-xf-group":function(e){return b(e).is(".xf-group")},"-xf-label":function(e){return b(e).is(".xf-label")}});b.fn.forces_alert=function(e){var g=b(this),h=g.closest(":-xf-control");h.find(".xf-alert").remove();h.each(function(){var d=b(this).children("fieldset").andSelf().eq(0),a=e||d.forces_validationMessage();a&&d.append(c.HTML_ALERT_INLINE(a))});
return g};b.fn.forces_hint=function(e){var g=b(this),h=g.closest(":-xf-control");h.find(".xf-hint").remove();e&&h.find(".xf-label").parent().append(c.HTML_HINT_INLINE(e));return g};b.fn.forces_label=function(){return b(this).closest(":-xf-control").find(":-xf-label").text()};b.fn.forces_validationMessage=function(){var e=b(this).find(c.EXPR_HTML_CONTROLS).andSelf().eq(0),g=e.forces_validity();if(g.valid)return"";else if(g.customError)return e.data("-tf-customValidityErrorMessage");else if(g.valueMissing)return c.MSG_MISSING;
else if(g.typeMismatch)return c.MSG_TYPE_MISMATCH[e.forces_attr("type")]};b(":-xf-control").live(c.EVENT_XF_REQUIRED,function(){b(this).find(".xf-required").remove().end().find(":-xf-label").after(c.HTML_REQUIRED())}).live(c.EVENT_XF_OPTIONAL,function(){b(this).removeClass(c.CSS_MISSING).find(".xf-required").remove()}).live(c.EVENT_XF_VALID,function(){b(this).forces_alert().removeClass(c.CSS_INVALID).addClass(c.CSS_VALID)}).live(c.EVENT_XF_INVALID,function(){b(this).removeClass(c.CSS_VALID).addClass(c.CSS_INVALID).forces_alert()}).live(c.EVENT_XF_FOCUS_IN,
function(){var e=b(this),g=e.closest(":-xf-group");e.closest("form").find("."+c.CSS_ACTIVE).not(e,g).removeClass(c.CSS_ACTIVE);e.add(g).addClass(c.CSS_ACTIVE)});b(":-xf-control, :-xf-group, .section").live(c.EVENT_XF_ENABLED,function(){b(this).find(c.EXPR_HTML_CONTROLS).each(function(){this.removeAttribute("disabled")}).end().stop(true,true).slideDown(c.MS_ENABLE)}).live(c.EVENT_XF_DISABLED,function(){b(this).find(c.EXPR_HTML_CONTROLS).each(function(){this.setAttribute("disabled","disabled")}).end().stop(true,
true).hide(c.MS_DISABLE)});b(":-tf-form").live(c.EVENT_XF_SUBMIT_ERROR,function(){var e=b(this),g=e.find(c.EXPR_HTML_CONTROLS).not(b("fieldset:-xf-irrelevant").find(c.EXPR_HTML_CONTROLS)),h=e.data("-tfui-status");if(!h){h=e.data("-tfui-status",c.HTML_STATUS()).data("-tfui-status");e.prevAll(".tf-status").children(".tf-alert").parent().remove()}var d=b("<ol></ol>");g=g.filter(":-xf-invalid");g.length&&g.each(function(){var a=b(this);a=b('<a href="#'+a.forces_id()+'">'+a.forces_label().replace(/[?:]*$/,
": ")+a.forces_validationMessage()+"</a>");d.append(b("<li></li>").append(a))});e.addClass(c.CSS_SUBMIT_ERROR).before(h.find("ol").replaceWith(d).end().fadeIn(300));h.forces_id(this.HTML_STATUS_ID);h.scrollTo({hash:true,focus:true})}).live(c.EVENT_TF_SUBMIT_SUPPRESSED,function(){b(this).find(":submit").shake({interval:75,distance:4,shakes:2})}).live(c.EVENT_XF_SUBMIT_DONE,function(){var e=b(this);e.data("-tfui-status")&&e.data("-tfui-status").remove();e.removeClass(c.CSS_SUBMIT_ERROR).addClass(c.CSS_SUBMIT_DONE)});
b(".tf-alert a").live("click",function(){var e=b(this).attr("href");if(e.indexOf("#")<0)return true;b(e.substring(e.indexOf("#"))).scrollTo({ancestor:":-xf-control",hash:true,focus:true});return false});b(".usetheforces").forces_enable(true);b(".xf-required").closest(":-xf-control").find(c.EXPR_HTML_CONTROLS).forces_attr("required",true)}(jQuery);
