(() => {
  'use strict';
  const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
  const panels=Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const tabList=document.querySelector('[role="tablist"]');
  const tabLayout=matchMedia('(max-width:767px)');
  function updateTabLayout(){tabList.setAttribute('aria-orientation',tabLayout.matches?'horizontal':'vertical');}
  tabLayout.addEventListener('change',updateTabLayout);updateTabLayout();
  const programme=document.querySelector('#programme');
  const visitDate=document.querySelector('#visit-date');
  const visitPeriod=document.querySelector('#visit-period');
  const bookingLink=document.querySelector('#booking-link');
  const masterNote=document.querySelector('#selected-master');
  const dateFields=document.querySelector('#date-fields');
  const priceLabel=document.querySelector('#booking-price');
  const amountLabel=document.querySelector('#booking-amount');
  const prices={dragon:'12 000 ₽',euphoria:'16 000 ₽',wind:'5 000 ₽'};
  const labels={consult:'Помогите, пожалуйста, выбрать программу.',dragon:'Интересует китайский спа-массаж «Энергия дракона».',euphoria:'Интересует спа-комплекс «Эйфория».',wind:'Интересует индивидуальный цигун «Сила ветра».',gift:'Хочу обсудить подарочный сертификат.'};
  let selectedMaster='';
  const localToday=new Date();
  const minDate=[localToday.getFullYear(),String(localToday.getMonth()+1).padStart(2,'0'),String(localToday.getDate()).padStart(2,'0')].join('-');
  visitDate.min=minDate;
  function updateMessage(){
    const parts=['Здравствуйте! Хочу запланировать визит в DandarCenter.',labels[programme.value]];
    if(programme.value!=='gift'){
      if(visitDate.value){const [y,m,d]=visitDate.value.split('-');parts.push('Удобная дата: '+d+'.'+m+'.'+y+'.');}
      if(visitPeriod.value)parts.push('Удобно '+visitPeriod.value+'.');
      if(selectedMaster)parts.push('Предпочтительный мастер: '+selectedMaster+'.');
      parts.push('Подскажите, пожалуйста, свободное время и стоимость.');
    }else parts.push('Расскажите, пожалуйста, о вариантах оформления.');
    bookingLink.href='https://wa.me/79161091663?text='+encodeURIComponent(parts.join('\n'));
    dateFields.hidden=programme.value==='gift';
    priceLabel.hidden=!prices[programme.value];
    amountLabel.textContent=prices[programme.value]||'';
    masterNote.hidden=!selectedMaster||programme.value==='gift';
    masterNote.textContent=selectedMaster?'Предпочтительный мастер: '+selectedMaster:'';
  }
  function activateTab(id,focus=false){
    tabs.forEach(tab=>{const active=tab.dataset.tab===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
    panels.forEach(panel=>panel.hidden=panel.id!=='panel-'+id);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>{activateTab(tab.dataset.tab);programme.value=tab.dataset.tab;selectedMaster='';updateMessage();});
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();const nextTab=tabs[next];activateTab(nextTab.dataset.tab,true);programme.value=nextTab.dataset.tab;selectedMaster='';updateMessage();}
    });
  });
  document.querySelectorAll('[data-book]').forEach(anchor=>anchor.addEventListener('click',()=>{
    programme.value=anchor.dataset.book;selectedMaster='';updateMessage();
  }));
  document.querySelectorAll('[data-master]').forEach(anchor=>anchor.addEventListener('click',()=>{
    selectedMaster=anchor.dataset.master;
    programme.value=selectedMaster==='Елена Ищенко'?'euphoria':'dragon';updateMessage();
  }));
  programme.addEventListener('change',()=>{selectedMaster='';if(['dragon','euphoria','wind'].includes(programme.value))activateTab(programme.value);updateMessage();});
  visitDate.addEventListener('change',updateMessage);
  visitPeriod.addEventListener('change',updateMessage);
  document.querySelector('#visit-form').addEventListener('submit',event=>event.preventDefault());
  updateMessage();
  bookingLink.addEventListener('click',event=>{if(!dateFields.hidden&&visitDate.value&&!visitDate.checkValidity()){event.preventDefault();visitDate.reportValidity();}});
  const menuButton=document.querySelector('.menu-toggle');
  const mobileMenu=document.querySelector('#mobile-menu');
  function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Меню';}
  menuButton.addEventListener('click',()=>{const open=mobileMenu.hidden;mobileMenu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'Закрыть':'Меню';});
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuButton.focus();}});
  matchMedia('(min-width:768px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
    if(img.closest('.logo,.footer-logo'))return;
    const note=document.createElement('span');note.className='image-error';note.textContent='Фото временно недоступно';
    const parent=img.parentElement;parent.append(note);img.style.opacity='0';
  },{once:true}));
})();
