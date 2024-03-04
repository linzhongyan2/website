var form;
var ii = 0;
var loop = false;
var tm = 0;
for (let i=0; i < 3; i++)
document.f00.attach.options[i].text = att[i];
var hints = {course:'e.g. 35-121', sessionname:'N1,N2',assignname:'Homework1',sid:'1234567', grade:'<=60',comment:'Error',content:'class Car'};
function clearhint(t)
{
   let x = ('|'+t.style.color +'|').replace(/\s/g,'');
   if (   x ==  '|rgb(102,102,102)|' || x == '|#666666|')
   {
       t.style.color = '#000000';
       t.value = '';
       t.style.fontWeight = '700';
   }
   
}
function puthint(t)
{
    if (t.value.replace(/\s/g,'') == '')
    {
        t.style.color = '#666666';
        t.value ='e.g ' + hints[t.name];
        t.style.fontWeight = '300';
    }
}
for (let i=0; i < document.f00.elements.length-3; i++)
{
    let ele = document.f00.elements[i];
    if (ele.tagName.toLowerCase() =='input' )
    {
        if (ss[ele.name] =='')
        {
            ele.value = 'e.g. ' + hints[ele.name];
            ele.style.color = '#666666';
            ele.style.fontWeight = '300';
        }
        else 
        {
            ele.value = ss[ele.name];
            ele.style.color = '#000000';
            ele.style.fontWeight = '700';
        }
    }
}
if (ss['attach'] == '1')
   document.f00.attach.selectedIndex = 1;
else if (ss['attach'] == '2')
   document.f00.attach.selectedIndex = 2; 
else  document.f00.attach.selectedIndex = 0; 
if (ss['questionnum'] != '')
   document.f00.questionnum.selectedIndex = parseInt(ss['questionnum']);
else  document.f00.questionnum.selectedIndex = 0; 
if (ss['semester'] != null)
{
    var j = 0;
    for (; j < document.f00.semester.options.length-1 && document.f00.semester.options[j].value!=ss['semester']; j++);
    document.f00.semester.selectedIndex = j; 
    
}
  
var msg; 
 document.f00.questionnum.selectedIndex = qn;
  document.f00.semester.style.fontWeight = '700';
  document.f00.questionnum.style.fontWeight = '700';
  document.f00.attach.style.fontWeight = '700';
  
function validate(f)
{
    if ( (''+f.course.style.color).replace(/\s/g,'') == 'rgb(102,102,102)' )
    {
        alert('Course can not be blank'); 
        f.course.focus();
        return false;
    }
     if (  (''+f.assignname.style.color).replace(/\s/g,'') == 'rgb(102,102,102)' )
    {
        alert('Assignment can not be blank'); 
        f.assignname.focus();
        return false;
    }
     if ( (''+f.sessionname.style.color).replace(/\s/g,'') == 'rgb(102,102,102)')
    {
        alert('Session   can not be blank'); 
        f.sessionname.focus();
        return false;
    }
    return true;
}
function choose()
{
     if (validate(document.f00) == false) return;
     for (var j=0; j < document.f00.elements.length; j++)
    {
        var ele = document.f00.elements[j];
        if (ele.tagName.toLowerCase() == 'input' && (''+ele.style.color).replace(/\s/g,'') == 'rgb(102,102,102)')
            ele.value = '';
    }
    document.f00.submit();
}

function test(i)
{
    for (var j=0; j < document.f00.elements.length; j++)
    {
        var ele = document.f00.elements[j];
        if (ele.tagName.toLowerCase() == 'input')
           ss[ele.name] = ele.value;
        else if (ele.tagName.toLowerCase() == 'select')
           ss[ele.name] =  ele.selectedIndex; 
    }
    if (i == 0 || i =='')
    {
      //  localStorage['gradeproj'] = JSON.stringify(ss);
    }
    ii = i;
    form = document.getElementById("fm" + i);
    msg = document.getElementById("msg" + i);
    if ( ''+i!='') 
    {
        msg.style.height = (form.offsetHeight - 5) + 'px';
        msg.style.border = '1px #666666 solid';
    }
    let fd = new FormData();
    fd.append("content", form.content.value);
    fd.append("course",  ss['course']);
    fd.append("assignname", ss['assignname']);
    fd.append("questionnum", ss['questionnum']);
    fd.append("sid", form.sid.value);
    let url = ss['tester'];
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
         xmlhttp = new XMLHttpRequest();
    }
    else
    {
         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            if ( ''+ii != '' && (new Date()).getTime() - tm > 60000)
            {
                form.comment.value = "contains infinite loops.";
            }
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'');
            msg.innerHTML = y.replace(/\n/g,'<br>');
            msg.style.border = '1px #666666 solid';
            if (''+ii != '')
            {  
               proc(y);
               save(ii);
            }
            else
                ans = y;
           
            closeprompt();
        }
    };
    let xx = new URLSearchParams(fd).toString();
    let xy = findPositionnoScrolling(form.content);
    let left = xy[0] + 100;
    let top = xy[1];
    myprompt('<img id=progress src=image/progress.gif>',null,null,'.....'); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px';
    tm = (new Date()).getTime();
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
}



function proc(t)
{
    if (ss['questionnum'] == '0')
    {
        if (t.includes("Compilation") || t.indexOf("Error: ") == 0)
        {
            form.comment.value = "Failed compilation";
            var m =   form.content.value.replace(/[^\n]/g,'').length ;
            if (form.comment.value.length<3) form.comment.value = "Error in codes not executable";
            form.assess.value = '';
            form.grade.value = 0;
            msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
            return;
        }
        form.comment.value = "Executed";
        var sc =  Math.ceil((ans.length - similarity(t, ans)) * fullscore/ans.length);
        form.assess.value = '';
        form.grade.value = sc;
        msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
        return;
    }
    if (t.includes("Compilation") || t.indexOf("Error: ") == 0)
    {
            form.comment.value += ss['questionnum'] +  ": Failed compilation;";
            var m =   form.content.value.replace(/[^\n]/g,'').length ;
            if (form.comment.value.length<3) form.comment.value = "Error in codes not executable";
            msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
            form.grade.value = parseFloat(form.grade.value) - parseFloat(form.score.value);
            form.score.value = 0;
    }
    else
    {
          form.comment.value += ss['questionnum'] +  ": executed;";
          var sc = similarity(t, ans);  
          sc =  Math.ceil((ans.length - sc) * subfull/ans.length);
          form.grade.value = parseFloat(form.grade.value) - parseFloat(form.score.value) + sc;
          form.score.value = sc;
          {
              var x = [];
              if (form.assess.value!='')
                  x = new CSVParse(form.assess.value, '|',',',';').nextMatrix();
              let hit = false;
              for (let k=0; k < x.length; k++)
              {
                  if (x[k][0] == ss['questionnum'])
                  {  
                      x[k][1] = ''+subfull;
                      x[k][2] = ''+sc; hit = true;
                      x[k][3] = t;
                      break;
                  }
              }
              if (hit == false)
                  x[x.length] = [''+ss['questionnum'], ''+ subfull, ''+sc, t];
              form.assess.value = '';
              for (let k=0; k < x.length; k++)
              {
                 if (k>0) form.assess.value += ';';
                 let w = x[k][3];
                 if (w == null) w = '';
                 else if (w.includes(',') || w.includes(';') || w.includes('|')) 
                     w = '|' + w.replace(/\\|/g,'||') +'|';
                 form.assess.value += x[k][0] + ',' + x[k][1] + ',' + x[k][2] + ',' + w; 
              }
          }
    }
    msg.innerHTML = t.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>').replace(/\^\s/g,'<br>');
    
}
function save(i)
{
    ii = i;
    form = document.getElementById("fm" + i);
    for (var j=0; j < document.f00.elements.length; j++)
    {
        if (document.f00.elements[j].tagName.toLowerCase() == 'input')
        ss[document.f00.elements[j].name] = document.f00.elements[j].value;
    }
    let fd = new FormData();
    
    fd.append("course", ss['course']);
    fd.append("assignname", ss['assignname']);
    if (''+i!='')
    {
        fd.append("sid", form.sid.value);
        fd.append("grade", form.grade.value);
        if (form.comment.value.length> 80) form.comment.value = form.comment.value.substring(0,80);
        fd.append("comment", form.comment.value);
        fd.append("assess", form.assess.value);
        fd.append("way", "save");
    }
    else
    {   
        fd.append("content", form.content.value);
        fd.append("questionnum",  ss['questionnum']);
        fd.append("sessionnames", form.sessionnames.value); 
        fd.append("way", "save0");
    }
    let url = form.action;
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
         xmlhttp = new XMLHttpRequest();
    }
    else
    {
         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'');
            if (''+ii=='')
            {
                myprompt(y);
                return;
            }
            var y = xmlhttp.responseText.replace(/^[ |\n|\r|\t]+/,'').replace(/[ |\n|\r|\t]+$/,'');
            myprompt(y);
            if (loop){
            if (ii < N-1 ) 
                test(ii+1);
            else 
                loop = false;
            }
             
        }
    };
    let xx = new URLSearchParams(fd).toString();
    let xy = findPositionnoScrolling(form.content);
    let left = xy[0] + 100;
    let top = xy[1];
    myprompt('<img id=progress src=image/progress.gif>',null,null,'.....'); 
    promptwin.style.cssText = '';
    promptwin.className = 'rundisk';
    promptwin.style.left = left + 'px';
    promptwin.style.top = top + 'px';
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(xx); 
}

onload = function()
{
    
        for (var j=0; j < document.f00.elements.length; j++)
        {
            var ele = document.f00.elements[j];
            if (ele.tagName.toLowerCase() == 'input')
               ss[ele.name] = ele.value;
           
            else if (ele.tagName.toLowerCase() == 'select')
               ss[ele.name] =  ele.selectedIndex; 
        }
       // localStorage['gradeproj'] = JSON.stringify(ss);
  
    if (document.f00.tester.value == '') 
        document.f00.tester.value = "GradeProgram";
    for (var n = 0; n < N; n++)
    {
        form = document.getElementById("fm" + n);
        var cont = form.content.value;
        var kk = cont.indexOf('package');
        if (kk == -1 || kk > 100) continue;
        var kkk = cont.indexOf('import ',kk);
        if (kkk ==-1 || kkk > 200) continue;
        form.content.value = cont.substring(kkk);
        form.content.parentNode.previousSibling.appendChild(document.createTextNode('deleted package'));
    }
}

