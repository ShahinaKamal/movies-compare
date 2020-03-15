const createAutocomplete=({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
})=>{   
    root.innerHTML = `
          <label><strong>Search </strong><label>
          <input class="input"/>
          <div class="dropdown">
              <div class="dropdown-menu">
                  <div class="dropdown-content results">
  
                  </div>
              </div>
          </div>`;

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

//restrict tjis function to be called too often
const onInput = async(event) => {
     const items=await fetchData(event.target.value);
     if(!items.length){
        dropdown.classList.remove('is-active');
        return;
     }   
     resultsWrapper.innerHTML='';
     dropdown.classList.add('is-active');
     for(let item of items){        
         const listItem=document.createElement('a');
         listItem.classList.add('dropdown-item');
         listItem.innerHTML=renderOption(item);
         listItem.addEventListener('click',()=>{
                input.value=inputValue(item);
                dropdown.classList.remove('is-active');
                onOptionSelect(item);
            })
         resultsWrapper.appendChild(listItem);
     }
};
input.addEventListener('input', debounce(onInput, 500));
document.addEventListener('click',(event)=>{
    
     if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    } 

});
};