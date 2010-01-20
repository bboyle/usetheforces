/*
 * usetheforces
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */
if(typeof(jQuery)!="undefined"){(function(c){var a=c.forces=c.forces||{};var f="January February March April May June July August September October November December".split(/ /);var e="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(/ /);var b=new Date();var d=function(h,g,i){h=String(h);while(h.length<g){h=String(i)+h}return h};a.dateFormat=function(g,h){if(!g){return""}if(!h){return g.toString()}return h.replace(/YYYY|yyyy|%Y/,g.getFullYear()).replace(/MM|%m/,d(g.getMonth()+1,2,"0")).replace(/dd|%d/,d(g.getDate(),2,"0")).replace(/%e/,d(g.getDate(),2," ")).replace(/d/,g.getDate()).replace(/%B/,f[g.getMonth()]).replace(/%A/,e[g.getDay()])};a.dateParse=function(p,j,m){p=p.split(/[^A-Za-z0-9]/);var g=j||m||b;var h={};function n(q,i){h[q]=h[q]||i}for(var k=0;k<p.length;k++){if(p[k].match(/^\d{4}$/)){n("year",p[k])}else{if(p[k].match(/^\d{1,2}$/)){var o=h.date?(h.month?"year":"month"):"date";if(o=="year"&&!h.year){p[k]=(g.getFullYear()+"").substring(0,2)+d(p[k],2,"0");if(j&&j.getFullYear()>p[k]){p[k]+=100}else{if(m&&m.getFullYear()<p[k]){p[k]-=100}else{if(!j&&!m&&p[k]>g.getFullYear()+20){p[k]-=100}}}}n(o,p[k])}}}if(h.date&&h.month&&h.year){var l=new Date(h.year,h.month-1,h.date);if(a.dateEquals(l,h.year,h.month,h.date)){return l}}return null};a.dateCalc=function(g,h){h=c.extend({year:0,month:0,date:0},h);return new Date(g.getFullYear()+h.year,g.getMonth()+h.month,g.getDate()+h.date)};a.dateEquals=function(h,j,g,i){return(h.getMonth()==g-1&&h.getDate()==i&&h.getFullYear()==j)};a.dateEndOfMonth=function(g){g=new Date(g.getFullYear(),g.getMonth(),31);if(g.getDate()!=31){g.setDate(31-g.getDate());g=this.dateCalc(g,{month:-1})}return g};a.DATE_TODAY=function(){return new Date(b.getFullYear(),b.getMonth(),b.getDate())};a.WEEKDAYS=function(){return e.slice()}})(jQuery)}if(typeof(jQuery)!="undefined"){(function(c){var a=c.forces=c.forces||{};var b=0;a.generateId=function(){return"tf-ID-"+ ++b}})(jQuery)}if(typeof(jQuery)!="undefined"){(function(b){var a=b.forces=b.forces||{};b.fn.forces_id=function(d){var c=b(this);if(!d||document.getElementById(d)){d=a.generateId()}return c.attr("id")||c.attr("id",d).attr("id")}})(jQuery)}if(typeof(jQuery)!="undefined"){(function(b){var a=b.forces=b.forces||{};b.fn.scrollTo=function(c){c=b.extend({hash:false,focus:false,distance:1},c);var d=b(this).eq(0);if(c.hash===true){location.hash=d.forces_id()}else{if(typeof c.hash==="object"){location.hash=c.hash.forces_id()}}if(c.focus===true){d.focus()}else{if(typeof c.focus=="object"){c.focus.focus()}}if(c.ancestor){d=d.closest(c.ancestor)}b("html,body").animate({scrollTop:d.offset().top-c.distance},100);return b(this)},b.fn.shake=function(c){c=b.extend({interval:75,distance:10,shakes:2},c);var d=b(this);var f=parseInt(d.css("marginLeft"))||0;var g=parseInt(d.css("marginRight"))||0;for(var e=0;e<c.shakes;e++){d.animate({marginLeft:f-c.distance,marginRight:g+c.distance},c.interval).animate({marginLeft:f+c.distance,marginRight:g-c.distance},c.interval)}return d.animate({marginLeft:f,marginRight:g},c.interval)}})(jQuery)}if(typeof(jQuery)!="undefined"){(function(e){var c=e.forces=e.extend(e.forces||{},{EVENT_XF_DISABLED:"-xf-disabled",EVENT_XF_ENABLED:"-xf-enabled",EVENT_XF_FOCUS_IN:"-xf-focus-in",EVENT_XF_FOCUS_OUT:"-xf-focus-out",EVENT_XF_OPTIONAL:"-xf-optional",EVENT_XF_REQUIRED:"-xf-required",EVENT_XF_VALID:"-xf-valid",EVENT_XF_INVALID:"-xf-invalid",EVENT_XF_VALUE_CHANGED:"-xf-value-changed",EVENT_XF_SUBMIT_DONE:"-xf-submit-done",EVENT_XF_SUBMIT_ERROR:"-xf-submit-error",EVENT_TF_SUBMIT_SUPPRESSED:"-tf-submit-suppressed",EXPR_HTML_CONTROLS:":text,select,textarea,.xf-select>fieldset,.xf-select1>fieldset",REXP_EMAIL:/^[A-Za-z!#$%&'*+-\/=?^_`{|}~\.]+@[A-Za-z0-9-]*[A-Za-z0-9]+(?:\.[A-Za-z0-9-]*[A-Za-z0-9]+)+$/,REXP_NUMBER:/^[0-9]+$/,SUBMIT_TOLERANCE:10000});var d="-tf-submitted";e.extend(e.expr[":"],{"-tf-not-validated":function(g){return(e(g).data("-tf-FLAGS")&48)==0},"-tf-validated":function(g){return(e(g).data("-tf-FLAGS")&48)!=0},"-xf-empty":function(g){return e.trim(e(g).forces_val()).length==0},"-xf-non-empty":function(g){return e.trim(e(g).forces_val()).length>0},"-xf-invalid":function(g){return(e(g).data("-tf-FLAGS")&32)==32},"-xf-irrelevant":function(g){return(e(g).data("-tf-FLAGS")&1)==1},"-xf-optional":function(g){return(e(g).data("-tf-FLAGS")&4)==0},"-xf-relevant":function(g){return(e(g).data("-tf-FLAGS")&1)==0},"-xf-required":function(g){return(e(g).data("-tf-FLAGS")&4)==4},"-xf-valid":function(g){return(e(g).data("-tf-FLAGS")&16)==16}});e.fn.forces_attr=function(g,h){if(typeof(h)=="undefined"){h=this.data("-tf-@"+g);return h?h:(this.is(":-xf-"+g)?g:null)}switch(g){case"relevant":this.forces__flags(2,h!==true&&h!="relevant");break;case"required":this.forces__flags(8,h===true||h=="required");break;case"type":break;default:return this}return this.data("-tf-@"+g,h===true?g:h).forces_recalculate()};e.fn.forces_removeAttr=function(g){switch(g){case"relevant":this.forces__flags(2,false);break;case"required":this.forces__flags(8,false);break;case"type":break;default:return this}return this.removeData("-tf-@"+g).forces_recalculate()};e.fn.forces_val=function(){var g=e(this);return g.val()||g.find(":checked").val()||null};e.fn.forces_setCustomValidity=function(g){return e(this).data("-tf-customValidityErrorMessage",g)},e.fn.forces_validity=function(){var g=e(this);return g.data("-tf-validity")||g.data("-tf-validity",{valueMissing:false,typeMismatch:false,valid:true}).data("-tf-validity")},e.fn.forces_recalculate=function(){var h,g;var i=function(l,j,m,k){l.forces__flags(j,m).trigger(k)};return this.each(function(){h=e(this);g=h.data("-tf-FLAGS")||0;switch(g&3){case 2:i(h,1,true,c.EVENT_XF_DISABLED);break;case 1:i(h,1,false,c.EVENT_XF_ENABLED);break}switch(g&12){case 8:i(h,4,true,c.EVENT_XF_REQUIRED);break;case 4:i(h,4,false,c.EVENT_XF_OPTIONAL);break}})};e.fn.forces_validate=function(g){return e(this).filter(function(){var j=e(this);var h=j.forces_validity();h.customError=!!j.data("-tf-customValidityErrorMessage");h.valueMissing=j.is(":-xf-required:-xf-empty");var i=e.trim(j.forces_val());if(i){switch(j.forces_attr("type")){case"email":h.typeMismatch=!c.REXP_EMAIL.exec(i);break;case"date":h.typeMismatch=c.dateParse(i)==null;break;case"number":h.typeMismatch=!c.REXP_NUMBER.exec(i);break;default:h.typeMismatch=false}}else{h.typeMismatch=false}h.valid=!(h.valueMissing||h.customError||h.typeMismatch);if(h.valid){j.forces__flags(32,false).forces__flags(16,true).trigger(c.EVENT_XF_VALID)}else{j.forces__flags(16,false).forces__flags(32,true).trigger(c.EVENT_XF_INVALID)}return g===undefined||g===h.valid})};e.fn.forces__flags=function(g,i){var h;this.set=function(){h=e(this);h.data("-tf-FLAGS",h.data("-tf-FLAGS")|g)};this.unset=function(){h=e(this);h.data("-tf-FLAGS",h.data("-tf-FLAGS")&~g)};return i?this.each(this.set):this.each(this.unset)};var a=function(h){var i=e(this);if(true){if(i.data(d)&&h.timeStamp-i.data(d)<c.SUBMIT_TOLERANCE){h.stopImmediatePropagation();i.trigger(c.EVENT_TF_SUBMIT_SUPPRESSED);return false}i.data(d,h.timeStamp);var g=i.find("fieldset:-xf-irrelevant").find(c.EXPR_HTML_CONTROLS);if(i.find(c.EXPR_HTML_CONTROLS).filter(":-xf-relevant").not(g).forces_validate(false).length){i.trigger(c.EVENT_XF_SUBMIT_ERROR);i.removeData(d);return false}}i.trigger(c.EVENT_XF_SUBMIT_DONE);return true};var b=function(g){var i=e(g.target);switch(g.type){case"click":case"focus":i.data("-tf-VALUE",i.val()).trigger(c.EVENT_XF_FOCUS_IN);break;case"blur":var h=i.data("-tf-VALUE");i.removeData("-tf-VALUE").trigger(c.EVENT_XF_FOCUS_OUT);if(i.val()!==h){i.trigger(c.EVENT_XF_VALUE_CHANGED).forces_validate()}break}};var f=function(g){var i=e(g.target).closest("fieldset");switch(g.type){case"focus":i.data("-tf-VALUE",i.forces_val()).trigger(c.EVENT_XF_FOCUS_IN);break;case"click":var h=i.data("-tf-VALUE");if(i.forces_val()!==h){i.trigger(c.EVENT_XF_VALUE_CHANGED).forces_validate()}break;case"blur":var h=i.data("-tf-VALUE");i.removeData("-tf-VALUE").trigger(c.EVENT_XF_FOCUS_OUT);if(i.forces_val()!==h){i.trigger(c.EVENT_XF_VALUE_CHANGED).forces_validate()}break}};e.fn.forces_enable=function(g){c.toggleFormHandlers(g,e(this))};c.toggleFormHandlers=function(g,h){h=h||e("form");if(g||g===undefined){h.bind("submit",a);e(":text,select,textarea",h).bind("focus blur click",b);e(":radio,:checkbox",h).bind("focus blur click",f)}else{h.unbind("submit",a);e(":text,select,textarea",h).unbind("focus blur click",b);e(":radio,:checkbox",h).unbind("focus blur click",f)}}})(jQuery)}if(typeof(jQuery)!="undefined"){(function(b){var a=b.forces=b.extend(b.forces||{},{CSS_ACTIVE:"tf-active",CSS_ALERT:"xf-alert",CSS_HINT:"xf-hint",CSS_INVALID:"xf-invalid",CSS_MISSING:"tf-missing",CSS_REQUIRED:"xf-required",CSS_SUBMIT_DONE:"xf-submit-done",CSS_SUBMIT_ERROR:"xf-submit-error",CSS_VALID:"xf-valid",MSG_INVALID:"is invalid",MSG_TYPE_MISMATCH:{date:"unrecognised date format",email:"must contain an email address",number:"must contain only digits"},MSG_MISSING:"must be completed",MSG_SUBMIT_ERROR:"Unable to process this form",HTML_ALERT_INLINE:function(d){return b("<em></em>").addClass(this.CSS_ALERT).text(d)},HTML_HINT_INLINE:function(d){return b('<small class="xf-hint"></small>').addClass(this.CSS_HINT).text(d)},HTML_REQUIRED:function(){return b(document.createElement("abbr")).addClass(this.CSS_REQUIRED).attr("title","required").text("*")},HTML_STATUS:function(){return b('<div class="tf-status"><div class="tf-alert inner"><h1>'+this.MSG_SUBMIT_ERROR+"</h1><ol></ol></div></div>")},HTML_STATUS_ID:"tf-status-alert",MS_ENABLE:300,MS_DISABLE:0});var c="-tfui-status";b.extend(b.expr[":"],{"-tf-form":function(d){return b(d).is(".tf-form")},"-xf-control":function(d){return b(d).is(".xf-input,.xf-select,.xf-select1,.xf-textarea")},"-xf-group":function(d){return b(d).is(".xf-group")},"-xf-label":function(d){return b(d).is(".xf-label")}});b.fn.forces_alert=function(e){var f=b(this);var d=f.closest(":-xf-control");d.find(".xf-alert").remove();d.each(function(){var h=b(this).children("fieldset").andSelf().eq(0);var g=e||h.forces_validationMessage();if(g){h.append(a.HTML_ALERT_INLINE(g))}});return f};b.fn.forces_hint=function(e){var f=b(this);var d=f.closest(":-xf-control");d.find(".xf-hint").remove();if(e){d.find(".xf-label").parent().append(a.HTML_HINT_INLINE(e))}return f};b.fn.forces_label=function(){return b(this).closest(":-xf-control").find(":-xf-label").text()};b.fn.forces_validationMessage=function(){var f=b(this).find(a.EXPR_HTML_CONTROLS).andSelf().eq(0);var d=f.forces_validity();if(d.valid){return""}else{if(d.customError){return f.data("-tf-customValidityErrorMessage")}else{if(d.valueMissing){return a.MSG_MISSING}else{if(d.typeMismatch){return a.MSG_TYPE_MISMATCH[f.forces_attr("type")]}}}}},b(":-xf-control").live(a.EVENT_XF_REQUIRED,function(){b(this).find(".xf-required").remove().end().find(":-xf-label").after(a.HTML_REQUIRED())}).live(a.EVENT_XF_OPTIONAL,function(){b(this).removeClass(a.CSS_MISSING).find(".xf-required").remove()}).live(a.EVENT_XF_VALID,function(){b(this).forces_alert().removeClass(a.CSS_INVALID).addClass(a.CSS_VALID)}).live(a.EVENT_XF_INVALID,function(){b(this).removeClass(a.CSS_VALID).addClass(a.CSS_INVALID).forces_alert()}).live(a.EVENT_XF_FOCUS_IN,function(){var e=b(this);var d=e.closest(":-xf-group");e.closest("form").find("."+a.CSS_ACTIVE).not(e,d).removeClass(a.CSS_ACTIVE);e.add(d).addClass(a.CSS_ACTIVE)});b(":-xf-control, :-xf-group, .section").live(a.EVENT_XF_ENABLED,function(){b(this).find(a.EXPR_HTML_CONTROLS).each(function(){this.removeAttribute("disabled")}).end().stop(true,true).slideDown(a.MS_ENABLE)}).live(a.EVENT_XF_DISABLED,function(){b(this).find(a.EXPR_HTML_CONTROLS).each(function(){this.setAttribute("disabled","disabled")}).end().stop(true,true).hide(a.MS_DISABLE)});b(":-tf-form").live(a.EVENT_XF_SUBMIT_ERROR,function(){var f=b(this);var e=f.find(a.EXPR_HTML_CONTROLS).not(b("fieldset:-xf-irrelevant").find(a.EXPR_HTML_CONTROLS));var d=f.data(c);if(!d){d=f.data(c,a.HTML_STATUS()).data(c);f.prev(".tf-status").children(".tf-alert").end().remove()}var h=b("<ol></ol>");var g=e.filter(":-xf-invalid");if(g.length){g.each(function(){var j=b(this);var i=b('<a href="#'+j.forces_id()+'">'+j.forces_label().replace(/[?:]*$/,": ")+j.forces_validationMessage()+"</a>");h.append(b("<li></li>").append(i))})}f.addClass(a.CSS_SUBMIT_ERROR).before(d.find("ol").replaceWith(h).end().fadeIn(300));d.forces_id(this.HTML_STATUS_ID);d.scrollTo({hash:true,focus:true})}).live(a.EVENT_TF_SUBMIT_SUPPRESSED,function(){b(this).find(":submit").shake({interval:75,distance:4,shakes:2})}).live(a.EVENT_XF_SUBMIT_DONE,function(){var d=b(this);if(d.data(c)){d.data(c).remove()}d.removeClass(a.CSS_SUBMIT_ERROR).addClass(a.CSS_SUBMIT_DONE)});b(".tf-alert a").live("click",function(){var d=b(this).attr("href");if(d.indexOf("#")<0){return true}b(d.substring(d.indexOf("#"))).scrollTo({ancestor:":-xf-control",hash:true,focus:true});return false});b(".usetheforces").forces_enable(true);b(".xf-required").closest(":-xf-control").find(a.EXPR_HTML_CONTROLS).forces_attr("required",true)})(jQuery)};