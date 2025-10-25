// Global variables
let expenseRows = 0;
let uploadedImages = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log("Expense Tracker Initialized");
    
    // Add first row
    addNewRow();
    
    // Add event listeners for real-time calculations
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('amount-input') || 
            e.target.classList.contains('transport-input') ||
            e.target.classList.contains('desc-input') ||
            e.target.classList.contains('date-input')) {
            calculateRowTotal(e.target);
            calculateAllTotals();
        }
    });

    // Add event listener for advance amount
    const advanceInput = document.getElementById('advanceAmount');
    if (advanceInput) {
        advanceInput.addEventListener('input', calculateFinalTotal);
    }
});

// Add new row to expense table
function addNewRow() {
    expenseRows++;
    const tbody = document.getElementById('expenseBody');
    const today = new Date().toISOString().split('T')[0];
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <input type="date" class="date-input" value="${today}">
        </td>
        <td>
            <select class="transport-input">
                <option value="">Select Transport</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Flight">Flight</option>
                <option value="Taxi">Taxi</option>
                <option value="Auto">Auto</option>
                <option value="Uber">Uber (Personal)</option>
                <option value="Ola">Ola</option>
                <option value="Rapido">Rapido</option>
                <option value="Bike">Bike</option>
                <option value="Metro">Metro</option>
                <option value="Other">Other</option>
            </select>
        </td>
        <td>
            <input type="text" class="desc-input" placeholder="Expense description">
        </td>
        <td>
            <input type="number" class="amount-input travel-amount" data-category="travel" min="0" value="0" placeholder="0">
        </td>
        <td>
            <input type="number" class="amount-input food-amount" data-category="food" min="0" value="0" placeholder="0">
        </td>
        <td>
            <input type="number" class="amount-input hotel-amount" data-category="hotel" min="0" value="0" placeholder="0">
        </td>
        <td>
            <input type="number" class="amount-input buy-amount" data-category="buy" min="0" value="0" placeholder="0">
        </td>
        <td>
            <input type="number" class="total-input" min="0" value="0" placeholder="0" readonly style="background-color: #f0f0f0; font-weight: bold;">
        </td>
        <td>
        <input type="text" class="Visit/Purpose" placeholder="Site-Name">
        </td>
        <td>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
    
    tbody.appendChild(row);
    
    // Add event listeners to the new row
    const amountInputs = row.querySelectorAll('.amount-input');
    amountInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateRowTotal(this);
            calculateAllTotals();
        });
    });
    
    calculateAllTotals();
}

// Delete a row
function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
    calculateAllTotals();
}

// Calculate total for a single row
function calculateRowTotal(input) {
    const row = input.closest('tr');
    const travel = parseFloat(row.querySelector('.travel-amount').value) || 0;
    const food = parseFloat(row.querySelector('.food-amount').value) || 0;
    const hotel = parseFloat(row.querySelector('.hotel-amount').value) || 0;
    const buy = parseFloat(row.querySelector('.buy-amount').value) || 0;
    
    const rowTotal = travel + food + hotel + buy;
    
    // Update the total input field
    const totalInput = row.querySelector('.total-input');
    totalInput.value = rowTotal;
    
    return rowTotal;
}

// Calculate all totals
function calculateAllTotals() {
    let travelTotal = 0;
    let foodTotal = 0;
    let hotelTotal = 0;
    let buyTotal = 0;
    let subtotal = 0;
    
    // Calculate category totals
    document.querySelectorAll('.travel-amount').forEach(input => {
        travelTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.food-amount').forEach(input => {
        foodTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.hotel-amount').forEach(input => {
        hotelTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.buy-amount').forEach(input => {
        buyTotal += parseFloat(input.value) || 0;
    });
    
    subtotal = travelTotal + foodTotal + hotelTotal + buyTotal;
    
    // Update display
    document.getElementById('travelTotal').textContent = travelTotal.toLocaleString();
    document.getElementById('foodTotal').textContent = foodTotal.toLocaleString();
    document.getElementById('hotelTotal').textContent = hotelTotal.toLocaleString();
    document.getElementById('buyTotal').textContent = buyTotal.toLocaleString();
    document.getElementById('subtotal').textContent = subtotal.toLocaleString();
    
    calculateFinalTotal();
}

// Calculate final total after advance
function calculateFinalTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace(/,/g, '')) || 0;
    const advance = parseFloat(document.getElementById('advanceAmount').value) || 0;
    const finalTotal = Math.max(0, subtotal - advance); // Ensure not negative
    
    document.getElementById('finalTotal').textContent = finalTotal.toLocaleString();
}

// Preview uploaded images
function previewImages() {
    const input = document.getElementById('receiptUpload');
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    uploadedImages = [];
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please upload only image files');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-container';
                imgContainer.style.display = 'inline-block';
                imgContainer.style.margin = '5px';
                imgContainer.style.textAlign = 'center';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.title = file.name;
                img.alt = 'Receipt image';
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                img.style.border = '2px solid #ddd';
                
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'remove-image-btn';
                removeBtn.style.background = '#ff4444';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.padding = '2px 8px';
                removeBtn.style.borderRadius = '4px';
                removeBtn.style.marginTop = '5px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.style.fontSize = '10px';
                removeBtn.onclick = function() {
                    imgContainer.remove();
                    // Remove from uploadedImages array
                    const index = uploadedImages.findIndex(item => item.name === file.name);
                    if (index > -1) {
                        uploadedImages.splice(index, 1);
                    }
                };
                
                imgContainer.appendChild(img);
                imgContainer.appendChild(removeBtn);
                preview.appendChild(imgContainer);
                
                uploadedImages.push({
                    name: file.name,
                    data: e.target.result
                });
            };
            
            reader.onerror = function() {
                alert('Error reading file: ' + file.name);
            };
            
            reader.readAsDataURL(file);
        });
    }
}

// Get all expense data for PDF
function getExpenseData() {
    const expenses = [];
    const rows = document.querySelectorAll('#expenseBody tr');
    
    rows.forEach(row => {
        const visit_purpose = parseFloatrow.querySelector('.Visit/Purpose').value;
        const travel = parseFloat(row.querySelector('.travel-amount').value) || 0;
        const food = parseFloat(row.querySelector('.food-amount').value) || 0;
        const hotel = parseFloat(row.querySelector('.hotel-amount').value) || 0;
        const buy = parseFloat(row.querySelector('.buy-amount').value) || 0;
        const description = row.querySelector('.desc-input').value;
        const transport = row.querySelector('.transport-input').value;
        const date = row.querySelector('.date-input').value;
        
        // Only include rows with actual data
        if (travel > 0 || food > 0 || hotel > 0 || buy > 0 || description.trim() !== '' || transport !== '') {
            const expense = {
                date: date,
                transport: transport,
                description: description,
                travel: travel,
                food: food,
                hotel: hotel,
                buy: buy,
                total: parseFloat(row.querySelector('.total-input').value) || 0,
                visit_purpose: visit_purpose
            };
            expenses.push(expense);
        }
    });
    
    return expenses;
}

// Get employee data for PDF
function getEmployeeData() {
    return {
        name: document.getElementById('empName').value || 'Not Provided',
        position: document.getElementById('empPosition').value || 'Not Provided',
        city: document.getElementById('empCity').value || 'Not Provided',
        mobile: document.getElementById('empMobile').value || 'Not Provided'
    };
}

// Get calculation data for PDF
function getCalculationData() {
    return {
        travelTotal: parseFloat(document.getElementById('travelTotal').textContent.replace(/,/g, '')) || 0,
        foodTotal: parseFloat(document.getElementById('foodTotal').textContent.replace(/,/g, '')) || 0,
        hotelTotal: parseFloat(document.getElementById('hotelTotal').textContent.replace(/,/g, '')) || 0,
        buyTotal: parseFloat(document.getElementById('buyTotal').textContent.replace(/,/g, '')) || 0,
        subtotal: parseFloat(document.getElementById('subtotal').textContent.replace(/,/g, '')) || 0,
        advance: parseFloat(document.getElementById('advanceAmount').value) || 0,
        finalTotal: parseFloat(document.getElementById('finalTotal').textContent.replace(/,/g, '')) || 0
    };
}

// Validate form before PDF generation
function validateForm() {
    const employeeName = document.getElementById('empName').value;
    if (!employeeName.trim()) {
        alert('Please enter your name before generating PDF');
        return false;
    }
    
    const expenses = getExpenseData();
    if (expenses.length === 0) {
        alert('Please add at least one expense before generating PDF');
        return false;
    }
    
    return true;
}

// Download PDF function - UPDATED VERSION
function downloadPDF() {
    console.log("Download PDF function started");
    
    // Validate form
    if (!validateForm()) {
        return;
    }

    try {
        // Check if jsPDF is available - UPDATED CHECK
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library not loaded. Please check internet connection and refresh the page.');
            return;
        }

        // CORRECT WAY to access jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        let yPosition = 20;
        
        // Add Header
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(33, 150, 243);
        pdf.text('EXPENSE REPORT', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        pdf.setDrawColor(33, 150, 243);
        pdf.line(20, yPosition, 190, yPosition);
        yPosition += 15;
        
        // Employee Details
        const employeeData = getEmployeeData();
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('EMPLOYEE DETAILS', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Name: ${employeeData.name}`, 20, yPosition);
        pdf.text(`Position: ${employeeData.position}`, 100, yPosition);
        yPosition += 6;
        
        pdf.text(`City: ${employeeData.city}`, 20, yPosition);
        pdf.text(`Mobile: ${employeeData.mobile}`, 100, yPosition);
        yPosition += 15;
        
        // Expense Table Header
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXPENSE DETAILS', 20, yPosition);
        yPosition += 10;
        
        // Table Headers
        const tableHeaders = ['Date', 'Transport', 'Description', 'Travel', 'Food', 'Hotel', 'Buy', 'Total'];
        const columnWidths = [18, 20, 55, 18, 18, 18, 18, 20];
        let xPosition = 20;
        
        // Header background
        pdf.setFillColor(33, 150, 243);
        pdf.setTextColor(255, 255, 255);
        
        tableHeaders.forEach((header, index) => {
            pdf.rect(xPosition, yPosition, columnWidths[index], 8, 'F');
            pdf.text(header, xPosition + 2, yPosition + 5);
            xPosition += columnWidths[index];
        });
        
        yPosition += 8;
        pdf.setTextColor(0, 0, 0);
        
        // Expense Rows
        const expenses = getExpenseData();
        expenses.forEach(expense => {
            // Check for new page
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }
            
            xPosition = 20;
            const rowData = [
                expense.date || '-',
                expense.transport || '-',
                expense.description || '-',
                `₹${expense.travel}`,
                `₹${expense.food}`,
                `₹${expense.hotel}`,
                `₹${expense.buy}`,
                `₹${expense.total}`,
                expense.visit_purpose || '-'
            ];
            
            rowData.forEach((data, index) => {
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                // Trim long text
                let displayText = data.toString();
                if (index === 2 && displayText.length > 30) { // Description column
                    displayText = displayText.substring(0, 30) + '...';
                }
                pdf.text(displayText, xPosition + 1, yPosition + 4, { 
                    maxWidth: columnWidths[index] - 2 
                });
                xPosition += columnWidths[index];
            });
            
            yPosition += 8;
            // Add line between rows
            pdf.line(20, yPosition, 190, yPosition);
            yPosition += 2;
        });
        
        yPosition += 10;
        
        // Summary Section
        const calculations = getCalculationData();
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXPENSE SUMMARY', 20, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        const summaryData = [
            `Travel Total: ₹${calculations.travelTotal.toLocaleString()}`,
            `Food Total: ₹${calculations.foodTotal.toLocaleString()}`,
            `Hotel Total: ₹${calculations.hotelTotal.toLocaleString()}`,
            `Buy Total: ₹${calculations.buyTotal.toLocaleString()}`,
            `Subtotal: ₹${calculations.subtotal.toLocaleString()}`,
            `Advance Received: ₹${calculations.advance.toLocaleString()}`,
            `Final Total: ₹${calculations.finalTotal.toLocaleString()}`
        ];
        
        summaryData.forEach(line => {
            if (yPosition > 270) {
                pdf.addPage();
                yPosition = 20;
            }
            pdf.text(line, 20, yPosition);
            yPosition += 6;
        });
        
        yPosition += 10;
        
        // Approval Section
        if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('APPROVAL', 20, yPosition);
        yPosition += 15;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text('Employee Signature: _________________________', 20, yPosition);
        pdf.text('Date: ___________', 140, yPosition);
        yPosition += 10;
        
        pdf.text('Manager Signature: _________________________', 20, yPosition);
        pdf.text('Date: ___________', 140, yPosition);
        
        // Generate filename
        const date = new Date().toISOString().split('T')[0];
        const filename = `Expense_Report_${employeeData.name.replace(/\s+/g, '_')}_${date}.pdf`;
        
        // Save PDF
        pdf.save(filename);
        console.log("PDF generated successfully: " + filename);
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Error generating PDF: ' + error.message);
    }
}

// Test PDF Library function
function testPDF() {
    console.log("Testing PDF Library...");
    
    if (typeof window.jspdf === 'undefined') {
        alert('❌ PDF library not loaded! Please check:\n1. Internet connection\n2. CDN links in HTML\n3. Refresh the page');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text('PDF Test Successful!', 20, 20);
        pdf.text('Your expense tracker is working!', 20, 30);
        pdf.save('test_successful.pdf');
        alert('✅ PDF library is working! Test file downloaded.');
    } catch (error) {
        alert('❌ PDF test failed: ' + error.message);
    }
}

// Add this function to check library status
function checkLibraryStatus() {
    console.log("Library Status:");
    console.log("jspdf:", typeof window.jspdf);
    console.log("jsPDF:", typeof jsPDF);
}
// Reset all data
function resetAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        // Clear employee details
        document.getElementById('empName').value = '';
        document.getElementById('empPosition').value = '';
        document.getElementById('empCity').value = '';
        document.getElementById('empMobile').value = '';
        document.getElementById('advanceAmount').value = '0';
        
        // Clear expense table
        document.getElementById('expenseBody').innerHTML = '';
        
        // Clear uploaded images
        document.getElementById('receiptUpload').value = '';
        document.getElementById('imagePreview').innerHTML = '';
        uploadedImages = [];
        
        // Reset totals
        document.getElementById('travelTotal').textContent = '0';
        document.getElementById('foodTotal').textContent = '0';
        document.getElementById('hotelTotal').textContent = '0';
        document.getElementById('buyTotal').textContent = '0';
        document.getElementById('subtotal').textContent = '0';
        document.getElementById('finalTotal').textContent = '0';
        
        // Add first row back
        addNewRow();
        
        alert('All data has been reset!');
    }
}

// Test function to check if everything is working
function testApplication() {
    console.log("=== APPLICATION TEST ===");
    console.log("Expense Rows:", expenseRows);
    console.log("Uploaded Images:", uploadedImages.length);
    console.log("Employee Data:", getEmployeeData());
    console.log("Expense Data:", getExpenseData());
    console.log("Calculation Data:", getCalculationData());
    console.log("PDF Library Available:", typeof jsPDF !== 'undefined');
    console.log("=== TEST COMPLETE ===");
    
    alert('Check browser console for test results (Press F12)');
}