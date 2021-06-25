const patchInput = document.querySelector('#patch-input')
const feedbackDiv = document.querySelector('#feedback')

fetch('/patch-metadata').then((response) => {
    response.json().then((patchData) => {
        
        patchData.forEach((data, index) => {
            
            const feedback = document.createElement('p')
            if (index === 1) {
                feedback.textContent = 'Güncellendi!'
                patchInput.defaultValue = patchData[1]
            } else {
                feedback.textContent = data
            }
            feedbackDiv.append(feedback)
            feedbackDiv.style.display = "block";
        })
        
    })
})