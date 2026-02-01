   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOJfd6I_ZNv6cqgshyQm9RewEQrKmZ8jpQh52nNZwqZ2p9Yr-Fr1cmrTo4WmVxpZ1Nog/exec';
        
        function selectRadio(radioId) {
            const radio = document.getElementById(radioId);
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        }

        // ✅ FILE HANDLING FUNCTIONS
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Show file preview
            const previewContainer = document.getElementById('filePreviewContainer');
            const fileName = document.getElementById('fileName');
            const fileSize = document.getElementById('fileSize');

            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            
            previewContainer.classList.add('show');
        }

        function removeFile() {
            const fileInput = document.getElementById('buktiTransfer');
            const previewContainer = document.getElementById('filePreviewContainer');
            
            // Clear file input
            fileInput.value = '';
            
            // Hide preview
            previewContainer.classList.remove('show');
            
            // Remove field-incomplete class if exists
            fileInput.classList.remove('field-incomplete');
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        function validateDpTerbilang(event) {
            const input = event.target;
            const value = input.value;
            const hasNumber = /[0-9]/.test(value);
            
            if (hasNumber) {
                // Remove numbers
                input.value = value.replace(/[0-9]/g, '');
                
                // Show warning modal
                showModal(
                    'warning',
                    'Terjadi Kesalahan',
                    'Kolom ini hanya boleh diisi dengan huruf.',
                    [
                        {
                            text: 'OK Min',
                            class: 'modal-btn-primary',
                            onclick: function() {
                                hideModal();
                                input.focus();
                            }
                        }
                    ]
                );
            }
        }

        function showModal(type, title, message, buttons) {
            console.log('🟢 showModal dipanggil:', { type, title, message });
            
            const modal = document.getElementById('modalOverlay');
            const modalIcon = document.getElementById('modalIcon');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalButtons = document.getElementById('modalButtons');

            if (!modal) {
                console.error('❌ Modal overlay tidak ditemukan!');
                alert(title + '\n\n' + message);
                return;
            }

            // Set icon
            if (type === 'success') {
                modalIcon.className = 'modal-icon success';
                modalIcon.innerHTML = '✓';
            } else if (type === 'warning') {
                modalIcon.className = 'modal-icon warning';
                modalIcon.innerHTML = '⚠';
            }

            // Set content
            modalTitle.textContent = title;
            modalMessage.textContent = message;

            // Set buttons
            modalButtons.innerHTML = '';
            buttons.forEach(function(btn) {
                const button = document.createElement('button');
                button.className = 'modal-btn ' + btn.class;
                button.textContent = btn.text;
                button.onclick = btn.onclick;
                modalButtons.appendChild(button);
            });

            // Show modal
            modal.classList.add('show');
            console.log('✅ Modal ditampilkan dengan class "show"');
        }

        function hideModal() {
            const modal = document.getElementById('modalOverlay');
            if (modal) {
                modal.classList.remove('show');
                console.log('🔴 Modal disembunyikan');
            }
        }

        // Close modal saat klik di luar
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('modalOverlay');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        hideModal();
                    }
                });
            }
        });

        function validateForm() {
            const form = document.getElementById('bookingForm');
            const incompleteFields = [];

            const textInputs = ['namaCpp', 'namaTuanRumah', 'alamat', 'sosmed', 'dpTerbilang'];
            textInputs.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    incompleteFields.push({
                        id: fieldId,
                        label: field.previousElementSibling.textContent.replace(' *', '')
                    });
                    field.classList.add('field-incomplete');
                } else {
                    field.classList.remove('field-incomplete');
                }
            });

            const selects = ['tanggal', 'bulan'];
            selects.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value) {
                    incompleteFields.push({
                        id: fieldId,
                        label: field.previousElementSibling.textContent.replace(' *', '')
                    });
                    field.classList.add('field-incomplete');
                } else {
                    field.classList.remove('field-incomplete');
                }
            });

            if (!document.querySelector('input[name="jenisAcara"]:checked')) {
                incompleteFields.push({
                    id: 'wedding',
                    label: 'Jenis Acara'
                });
            }

            const jenisAcara = document.querySelector('input[name="jenisAcara"]:checked');
            if (jenisAcara && jenisAcara.value !== 'other' && !document.querySelector('input[name="paket"]:checked')) {
                incompleteFields.push({
                    id: 'paketWedding',
                    label: 'Paket'
                });
            }

            const fileInput = document.getElementById('buktiTransfer');
            if (!fileInput.files.length) {
                incompleteFields.push({
                    id: 'buktiTransfer',
                    label: 'Bukti Transfer'
                });
                fileInput.classList.add('field-incomplete');
            } else {
                fileInput.classList.remove('field-incomplete');
            }

            if (jenisAcara && jenisAcara.value === 'other') {
                const otherText = document.getElementById('otherText');
                if (!otherText.value.trim()) {
                    incompleteFields.push({
                        id: 'otherText',
                        label: 'Jenis Acara Lainnya'
                    });
                    otherText.classList.add('field-incomplete');
                } else {
                    otherText.classList.remove('field-incomplete');
                }
            }

            return incompleteFields;
        }

        document.getElementById('bookingForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const incompleteFields = validateForm();
            
            if (incompleteFields.length > 0) {
                const firstField = incompleteFields[0];
                console.log('⚠️ Form tidak lengkap:', incompleteFields);
                showModal(
                    'warning',
                    'Data Belum Lengkap',
                    `Mohon lengkapi data Anda. Ada ${incompleteFields.length} kolom yang belum diisi.`,
                    [
                        {
                            text: 'Lengkapi Data',
                            class: 'modal-btn-primary',
                            onclick: function() {
                                hideModal();
                                const element = document.getElementById(firstField.id);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    setTimeout(function() { 
                                        element.focus(); 
                                    }, 500);
                                }
                            }
                        },
                        {
                            text: 'Tutup',
                            class: 'modal-btn-secondary',
                            onclick: function() {
                                hideModal();
                            }
                        }
                    ]
                );
                return;
            }
            
            const fileInput = document.getElementById('buktiTransfer');
            const file = fileInput.files[0];
            const statusDiv = document.getElementById('uploadStatus');
            
            if (file.size > 5 * 1024 * 1024) {
                showModal(
                    'warning',
                    'File Terlalu Besar',
                    'Ukuran file maksimal 5 MB. Mohon pilih file yang lebih kecil.',
                    [
                        {
                            text: 'OK',
                            class: 'modal-btn-primary',
                            onclick: function() {
                                hideModal();
                            }
                        }
                    ]
                );
                return;
            }
            
            statusDiv.innerHTML = '<div class="alert alert-info"><span class="loading"></span> Mengupload file...</div>';
            
            const reader = new FileReader();
            reader.onload = async function(e) {
                const base64Data = e.target.result.split(',')[1];
                
                let jenisAcara = document.querySelector('input[name="jenisAcara"]:checked')?.value;
                if (jenisAcara === 'other') {
                    jenisAcara = document.getElementById('otherText').value || 'Other (tidak diisi)';
                }
                
                const formData = {
                    namaCpp: document.getElementById('namaCpp').value,
                    namaTuanRumah: document.getElementById('namaTuanRumah').value,
                    alamat: document.getElementById('alamat').value,
                    tanggal: document.getElementById('tanggal').value,
                    bulan: document.getElementById('bulan').value,
                    jenisAcara: jenisAcara,
                    paket: document.querySelector('input[name="paket"]:checked')?.value,
                    sosmed: document.getElementById('sosmed').value,
                    dpTerbilang: document.getElementById('dpTerbilang').value,
                    fileName: file.name,
                    fileData: base64Data,
                    mimeType: file.type
                };
                
                try {
                    const response = await fetch(SCRIPT_URL, {
                        method: 'POST',
                        redirect: 'follow',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        statusDiv.innerHTML = '';
                        showModal(
                            'success',
                            'Tanggal Terkunci!',
                            'Terima kasih! Booking Anda telah berhasil disubmit. Tim kami akan segera menghubungi Anda.',
                            [
                                {
                                    text: 'OK',
                                    class: 'modal-btn-primary',
                                    onclick: function() {
                                        hideModal();
                                        document.getElementById('bookingForm').reset();
                                        document.getElementById('paketWedding').style.display = 'none';
                                        document.getElementById('paketEngagement').style.display = 'none';
                                        document.getElementById('paketPrewedding').style.display = 'none';
                                        document.getElementById('otherInput').style.display = 'none';
                                        // Reset file preview
                                        removeFile();
                                    }
                                }
                            ]
                        );
                    } else {
                        statusDiv.innerHTML = '';
                        showModal(
                            'warning',
                            'Upload Gagal',
                            'Maaf, terjadi kesalahan saat mengupload: ' + result.message,
                            [
                                {
                                    text: 'Coba Lagi',
                                    class: 'modal-btn-primary',
                                    onclick: function() {
                                        hideModal();
                                    }
                                }
                            ]
                        );
                    }
                } catch (error) {
                    statusDiv.innerHTML = '';
                    showModal(
                        'warning',
                        'Terjadi Kesalahan',
                        'Maaf, terjadi kesalahan: ' + error.message + '. Silakan coba lagi.',
                        [
                            {
                                text: 'Coba Lagi',
                                class: 'modal-btn-primary',
                                onclick: function() {
                                    hideModal();
                                }
                            }
                        ]
                    );
                    console.error('Error detail:', error);
                }
            };
            
            reader.readAsDataURL(file);
        });

        function copyRekening() {
            const rekeningNumber = document.getElementById('rekeningNumber').textContent;
            
            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(rekeningNumber)
                    .then(function() {
                        showModal(
                            'success',
                            'Berhasil!',
                            'Nomor rekening berhasil dicopy: ' + rekeningNumber,
                            [
                                {
                                    text: 'OK',
                                    class: 'modal-btn-primary',
                                    onclick: function() {
                                        hideModal();
                                    }
                                }
                            ]
                        );
                    })
                    .catch(function(err) {
                        fallbackCopyToClipboard(rekeningNumber);
                    });
            } else {
                // Fallback for older browsers and mobile
                fallbackCopyToClipboard(rekeningNumber);
            }
        }
        
        function fallbackCopyToClipboard(text) {
            // Create temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            
            // Select and copy
            textarea.focus();
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showModal(
                        'success',
                        'Berhasil!',
                        'Nomor rekening berhasil dicopy: ' + text,
                        [
                            {
                                text: 'OK',
                                class: 'modal-btn-primary',
                                onclick: function() {
                                    hideModal();
                                }
                            }
                        ]
                    );
                } else {
                    showModal(
                        'warning',
                        'Gagal Copy',
                        'Silakan copy manual: ' + text,
                        [
                            {
                                text: 'OK',
                                class: 'modal-btn-primary',
                                onclick: function() {
                                    hideModal();
                                }
                            }
                        ]
                    );
                }
            } catch (err) {
                showModal(
                    'warning',
                    'Gagal Copy',
                    'Silakan copy manual: ' + text,
                    [
                        {
                            text: 'OK',
                            class: 'modal-btn-primary',
                            onclick: function() {
                                hideModal();
                            }
                        }
                    ]
                );
            }
            
            document.body.removeChild(textarea);
        }

        function showPackages(type) {
            document.getElementById('paketWedding').style.display = 'none';
            document.getElementById('paketEngagement').style.display = 'none';
            document.getElementById('paketPrewedding').style.display = 'none';
            document.getElementById('otherInput').style.display = 'none';
            
            document.querySelectorAll('input[name="paket"]').forEach(radio => {
                radio.checked = false;
            });
            
            if (type === 'wedding' || type === 'ngunduh-mantu') {
                document.getElementById('paketWedding').style.display = 'block';
            } else if (type === 'engagement') {
                document.getElementById('paketEngagement').style.display = 'block';
            } else if (type === 'prewedding') {
                document.getElementById('paketPrewedding').style.display = 'block';
            } else if (type === 'other') {
                document.getElementById('otherInput').style.display = 'block';
            }
        }

        // DATE PICKER FUNCTIONS
        let selectedMonth = '';
        let selectedMonthName = '';
        let selectedDate = '';

        function openDatePicker() {
            const modal = document.getElementById('datePickerModal');
            modal.classList.add('show');
            generateDateGrid();
        }

        function closeDatePicker() {
            const modal = document.getElementById('datePickerModal');
            modal.classList.remove('show');
        }

        function selectMonth(monthValue, monthName) {
            selectedMonth = monthValue;
            selectedMonthName = monthName;
            
            // Remove selected class from all months
            document.querySelectorAll('.month-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add selected class to clicked month
            event.target.closest('.month-item').classList.add('selected');
            
            // Generate dates for selected month
            generateDateGrid();
        }

        function generateDateGrid() {
            const dateGrid = document.getElementById('dateGrid');
            dateGrid.innerHTML = '';
            
            const maxDays = selectedMonth === 'februari' ? 29 : 
                           ['april', 'juni', 'september', 'november'].includes(selectedMonth) ? 30 : 31;
            
            for (let i = 1; i <= maxDays; i++) {
                const dateItem = document.createElement('button');
                dateItem.type = 'button';
                dateItem.className = 'date-item';
                dateItem.textContent = i;
                dateItem.onclick = function() { selectDate(i); };
                
                if (selectedDate === i.toString()) {
                    dateItem.classList.add('selected');
                }
                
                dateGrid.appendChild(dateItem);
            }
        }

        function selectDate(date) {
            selectedDate = date.toString();
            
            // Remove selected class from all dates
            document.querySelectorAll('.date-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add selected class to clicked date
            event.target.classList.add('selected');
        }

        function confirmDateSelection() {
            if (!selectedMonth || !selectedDate) {
                alert('Mohon pilih bulan dan tanggal terlebih dahulu');
                return;
            }
            
            // Set hidden inputs
            document.getElementById('tanggal').value = selectedDate;
            document.getElementById('bulan').value = selectedMonth;
            
            // Update display
            const dateDisplay = document.getElementById('dateDisplay');
            const dateText = document.getElementById('selectedDateText');
            dateText.textContent = `${selectedDate} ${selectedMonthName} 2026`;
            dateDisplay.classList.add('selected');
            
            // Remove field-incomplete class if exists
            dateDisplay.classList.remove('field-incomplete');
            
            // Close modal
            closeDatePicker();
        }

        // Close date picker when clicking outside
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('datePickerModal');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeDatePicker();
                    }
                });
            }
        });