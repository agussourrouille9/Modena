async function buscarPatente() {
      const patente = document.getElementById("patenteInput").value.trim().toUpperCase();
      const resultadoDiv = document.getElementById("resultado");
      const btn = document.getElementById("buscarBtn");
      const btnText = document.getElementById("btnText");
      const btnSpinner = document.getElementById("btnSpinner");

      resultadoDiv.innerHTML = "";

      // Mostrar spinner y cambiar texto
      btn.disabled = true;
      btnText.textContent = "Buscando...";
      btnSpinner.classList.remove("hidden");

      if (!patente) {
        btn.disabled = false;
        btnText.textContent = "Buscar";
        btnSpinner.classList.add("hidden");
        resultadoDiv.innerHTML = "<p class='text-red-500'>Por favor ingresá una patente.</p>";
        return;
      }

      try {
        const response = await fetch(`https://script.google.com/macros/s/AKfycbx766CUdCru7UlvpLeeC2pm-0hlldiBFY2Ue_RpEGsr12ww957WU5Bc0JaVk5-AfYXB4g/exec?patente=${patente}`);
        const data = await response.json();

        if (data.error) {
          resultadoDiv.innerHTML = "<p class='text-red-500'>No se encontró la patente.</p>";
        } else {
          let html = `
            <p><strong>Marca:</strong> ${data.marca}</p>
            <p><strong>Modelo:</strong> ${data.modelo}</p>
            <p><strong>Kilometraje:</strong> ${data.km}</p>
            <p><strong>Lubricante:</strong> ${data.lubricante}</p>
            <p><strong>Próximo service:</strong> ${data.proximoService}</p>
          `;

          // Mostrar lista de cambios si hay
          if (Array.isArray(data.cambios) && data.cambios.length > 0) {
            html += `<p><strong>Cambios:</strong></p><ul class="list-disc list-inside">`;
            data.cambios.forEach(cambio => {
              html += `<li>${cambio}</li>`;
            });
            html += `</ul>`;
          }

          // Mostrar observaciones solo si existen
          if (data.observaciones) {
            html += `<p><strong>Observaciones:</strong> ${data.observaciones}</p>`;
          }

          resultadoDiv.innerHTML = html;
        } 
      } catch (error) {
        resultadoDiv.innerHTML = "<p class='text-red-500'>Hubo un error en la consulta.</p>";
        console.error(error);
      } finally {
        // Restaurar botón
        btn.disabled = false;
        btnText.textContent = "Buscar";
        btnSpinner.classList.add("hidden");
      }
    }