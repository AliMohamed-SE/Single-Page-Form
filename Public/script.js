document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = new FormData(form);
    const data = {
      full_name: formData.get("FullName"),
      id_number: formData.get("id_number"),
      phone_number: formData.get("phone_number"), // If you have this field, add it here
      gender: formData.get("gender"),
      diploma_name: formData.get("diploma_name"),
      training_coordinator: formData.get("training_coordinator"),
    };

    console.log(data);

    // Send data to backend
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Show success message
      const toast = new bootstrap.Toast(
        document.getElementById("thankYouToast")
      );
      toast.show();
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
