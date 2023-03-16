form.addEventListener("submit", () => {
    const addDep = {
        departement: departement.value,
        user: user.value,
        materiel: materiel.value,
        descMateriel: descMateriel.value,
        ip: ip.value,
        needs: needs.value
    }
    fetch('/api/addDep', {
        method: 'POST',
        body: JSON.stringify(addDep),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        if(data.status == 'error') {
            success.style.display = 'none'
            error.style.display = 'block'
            error.innerText = data.error
        } else {
            error.style.display = 'none'
            success.style.display = 'block'
            success.innerText = data.success
        }
    })
})