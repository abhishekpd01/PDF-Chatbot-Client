const freeUpResources = async (emailId) => {
    // Once the user Sign-out, we free up the uploaded document from Vector DB.
    // we call the api on server for deleting the uploaded document from Vector DB.

    try {
        await fetch('https://pdf-chatbot-server.onrender.com/cleanUpResources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailId }),
        });

        console.log(`All resources associated with ${emailId} have been cleaned up!`);
    } catch (error) {
        console.error('Error freeing up resources', error);
    }
}

export default freeUpResources;