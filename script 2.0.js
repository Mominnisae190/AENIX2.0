const token = "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"; 
const inputTxt = document.getElementById("input");
const image = document.getElementById("image");
const button = document.getElementById("btn");
let timerInterval;
let time = 0;

async function query() {
    if (!inputTxt.value.trim()) {
        alert("Please enter a prompt.");
        return null;
    }

    const previousImage = image.src;
    image.src = "/loading.gif";

    time = 0;
    document.getElementById('timer').textContent = `Timer: ${time}s`;
    timerInterval = setInterval(function() {
        time++;
        document.getElementById('timer').textContent = `Timer: ${time}s`;
    }, 1000);

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: inputTxt.value.trim() }),
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const blob = await response.blob();
        stopTimer(); 
        return blob;

    } catch (error) {
        console.error("Error:", error);
        alert("Please Enter Meaningful prompt OR External Error");
        image.src = previousImage;
        stopTimer(); 
        return null;
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    
}


button.addEventListener("click", async function () {
    const response = await query();
    if (response) {
        const imageUrl = URL.createObjectURL(response);
        image.src = imageUrl;

        downloadBtn.style.display = "block";
        downloadBtn.href = imageUrl;
        downloadBtn.download = "Aenix.png";
    }
});

