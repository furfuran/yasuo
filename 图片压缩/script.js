document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewSection = document.getElementById('previewSection');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;
    let compressedFile = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#c7c7c7';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#c7c7c7';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) {
            compressImage(originalFile, e.target.value / 100);
        }
    });

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
        if (compressedFile) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(compressedFile);
            link.download = `compressed_${originalFile.name}`;
            link.click();
        }
    });

    // 处理图片上传
    async function handleImageUpload(file) {
        originalFile = file;
        previewSection.hidden = false;

        // 显示原图预览
        originalPreview.src = URL.createObjectURL(file);
        originalSize.textContent = formatFileSize(file.size);

        // 压缩图片
        await compressImage(file, qualitySlider.value / 100);
    }

    // 压缩图片
    async function compressImage(file, quality) {
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                quality: quality
            };

            compressedFile = await imageCompression(file, options);
            compressedPreview.src = URL.createObjectURL(compressedFile);
            compressedSize.textContent = formatFileSize(compressedFile.size);
        } catch (error) {
            console.error('压缩失败:', error);
        }
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 