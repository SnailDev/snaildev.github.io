function AlexaSiteStatsWidget(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e=/http[s]?:\/\/.*\/js\/site-stats\.min\.js.?p=(.)(.)((?:[&]|&amp;)url=([^\?&]*))?/i;this.replaceScripts=function(){var a=document.getElementsByTagName("script"),i=a[a.length-1],r=i.src;if(null!=r){var s=r.match(e),c=decodeURIComponent(s[4]||document.location.hostname);if(null!=s){var n=function(e){var a,i,r,s,c,n,l,o="",h=0;do{a=e.charCodeAt(h++),i=e.charCodeAt(h++),r=e.charCodeAt(h++),s=a>>2,c=(3&a)<<4|i>>4,n=(15&i)<<2|r>>6,l=63&r,isNaN(i)?n=l=64:isNaN(r)&&(l=64),o=o+t.charAt(s)+t.charAt(c)+t.charAt(n)+t.charAt(l)}while(h<e.length);return o}(c),l="http://xsltcache.alexa.com/site_stats/gif/"+s[1]+"/"+s[2]+"/"+n+"/s.gif",o=new Image;o.src=l,o.setAttribute("border","0"),"s"==s[1]?o.alt="Alexa Certified Traffic Ranking for "+c:o.alt="Alexa Certified Site Stats for "+c;var h=document.createElement("a");h.setAttribute("href","https://www.alexa.com/siteinfo/"+c),h.setAttribute("target","_blank"),h.className="AlexaSiteStatsWidget",h.appendChild(o),i.parentNode.insertBefore(h,i)}}}}(new AlexaSiteStatsWidget).replaceScripts();