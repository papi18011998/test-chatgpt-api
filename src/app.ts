const form = document.querySelector<HTMLFormElement>("form")!;
const ageInput = document.querySelector<HTMLInputElement>("#age")!;
const themesInput = document.querySelector<HTMLInputElement>("#themes")!;
const submitButton = document.querySelector<HTMLButtonElement>("button")!;
const footer = document.querySelector<HTMLElement>("footer")!;
const API_BASE_URL = 'https://api.openai.com/v1/completions';
const OPENAI_API_KEY = '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'

/**
 * Cette fonction permet de construire la phrase permettan de contacter l'api
 * @param age 
 * @param themes 
 * @returns 
 */
const generatePromptByAgeAndThemes = (age: number, themes='')=>{
    let prompt = `Propose moi, avec un ton joyeux et amical,
    5 idées de cadeau pour une personne âgée de ${age} ans`

    if(themes.trim()){
        prompt += `et qui aime, ${themes}`
    }
    return prompt +='!';

}

/**
 * Mettre le bouton et le footer en mode "loading"
 */
const setLoadingItems = ()=>{
    footer.textContent = 'Chargement des idées ...'
    footer.setAttribute("aria-busy", "true")
    submitButton.setAttribute("aria-busy", "true")
    submitButton.disabled = true;
}
/**
 * Enlever le mode "loading" du bouton et du footer 
 */
const unsetLoadingItems = ()=>{
    footer.setAttribute("aria-busy", "false")
    submitButton.setAttribute("aria-busy", "false")
    submitButton.disabled = false;
}
/**
 * Lancer tout le syteme à la soumission du formulaire
 */
form.addEventListener("submit",(e:SubmitEvent)=>{
    e.preventDefault()
    //simmulation chargement
    setLoadingItems();
    const data = {
        prompt: generatePromptByAgeAndThemes(ageInput.valueAsNumber,themesInput.value),
        max_tokens: 2000,
        model: "text-davinci-003"
    }
    //appel de l'api pour poser la question
    fetch(API_BASE_URL,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(data)
    })
    .then((response)=>{
        response.json().then((data)=>{
            footer.innerHTML = translateText(data.choices[0].text)
            
        })
    }).finally(()=>{
        unsetLoadingItems()
    })
})

/**
 * transformation de la reponse envoyee
 * @param text
 */
const translateText = (text: string)=>{
    return text.split("\n")
    .map((str)=>`<p>${str}</p>`)
    .join("")
}