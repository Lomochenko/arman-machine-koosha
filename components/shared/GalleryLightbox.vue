<template>
  <Teleport to="body">
    <!-- Lightbox Overlay -->
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen"
        class="gallery-lightbox-overlay"
        @keydown.esc="closeLightbox"
      >
        <!-- Lightbox Container -->
        <div class="gallery-lightbox-container" @click.stop>
          <!-- Close Button -->
          <button
            class="lightbox-close-btn"
            aria-label="Close gallery"
            @click="closeLightbox"
          >
            <span class="material-icons">close</span>
          </button>

          <!-- Navigation Buttons -->
          <button
            v-if="totalImages > 1"
            class="lightbox-nav-btn lightbox-nav-prev"
            aria-label="Previous image"
            @click="previousImage"
          >
            <span class="material-icons">chevron_left</span>
          </button>

          <button
            v-if="totalImages > 1"
            class="lightbox-nav-btn lightbox-nav-next"
            aria-label="Next image"
            @click="nextImage"
          >
            <span class="material-icons">chevron_right</span>
          </button>

          <!-- Image Container -->
          <div class="lightbox-image-wrapper">
            <img
              :src="currentImage.src"
              :alt="currentImage.alt"
              class="lightbox-image"
              loading="eager"
              @click="toggleDescription"
            />
          </div>

          <!-- Image Info -->
          <div class="lightbox-info">
            <!-- Description with Title and Blur Background -->
            <Transition name="description-fade">
              <div
                v-if="showDescription"
                class="lightbox-description"
              >
                <div class="description-title">{{ currentImage.title }}</div>
                <div class="description-content">{{ currentImage.description }}</div>
              </div>
            </Transition>

            <!-- Counter -->
            <div v-if="totalImages > 1" class="lightbox-counter">
              {{ currentIndex + 1 }} / {{ totalImages }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface GalleryImage {
  src: string
  alt: string
  title: string
  description: string
}

const props = defineProps<{
  images: GalleryImage[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = ref(false)
const currentIndex = ref(props.initialIndex || 0)
const showDescription = ref(true)

const currentImage = computed(() => props.images[currentIndex.value])
const totalImages = computed(() => props.images.length)

const openLightbox = (index: number = 0) => {
  currentIndex.value = index
  isOpen.value = true
  showDescription.value = true

  // Prevent body scroll and blur header
  document.body.style.overflow = 'hidden'
  const header = document.querySelector('.site-header') as HTMLElement
  if (header) {
    header.style.filter = 'blur(8px)'
    header.style.opacity = '0.5'
  }

  // Focus on container for keyboard events
  setTimeout(() => {
    const container = document.querySelector('.gallery-lightbox-container') as HTMLElement
    if (container) container.focus()
  }, 0)
}

const closeLightbox = () => {
  isOpen.value = false
  showDescription.value = true

  document.body.style.overflow = ''
  const header = document.querySelector('.site-header') as HTMLElement
  if (header) {
    header.style.filter = 'none'
    header.style.opacity = '1'
  }
  emit('close')
}

const nextImage = () => {
  if (currentIndex.value < totalImages.value - 1) {
    currentIndex.value++
    showDescription.value = true
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showDescription.value = true
  }
}

const toggleDescription = () => {
  showDescription.value = !showDescription.value
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (e.key) {
    case 'ArrowRight':
      nextImage()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'Escape':
      closeLightbox()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Expose methods for parent component
defineExpose({
  openLightbox,
  closeLightbox
})
</script>

<style scoped>
.gallery-lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: default;
}

.gallery-lightbox-container {
  position: relative;
  width: 90%;
  max-width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  outline: none;
}

/* Close Button */
.lightbox-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  color: #fff;
  font-size: 24px;
  padding: 0;
}

.lightbox-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.lightbox-close-btn:active {
  transform: scale(0.95);
}

/* Navigation Buttons */
.lightbox-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #fff;
  font-size: 28px;
  transition: all 0.3s ease;
  padding: 0;
}

.lightbox-nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.lightbox-nav-prev {
  left: 20px;
}

.lightbox-nav-next {
  right: 20px;
}

/* Image Container */
.lightbox-image-wrapper {
  width: 100%;
  height: calc(100% - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* Info Section */
.lightbox-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  text-align: center;
  color: #fff;
}

.lightbox-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.lightbox-description {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.description-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.description-content {
  max-width: 600px;
  margin: 0 auto;
}

.lightbox-counter {
  font-size: 13px;
  opacity: 0.7;
  letter-spacing: 0.5px;
}

/* Transitions */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.description-fade-enter-active,
.description-fade-leave-active {
  transition: opacity 0.4s ease;
}

.description-fade-enter-from,
.description-fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .gallery-lightbox-container {
    width: 95%;
    max-width: 95vw;
    height: 95vh;
  }

  .lightbox-close-btn {
    width: 44px;
    height: 44px;
    top: 15px;
    right: 15px;
    font-size: 20px;
  }

  .lightbox-nav-btn {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .lightbox-nav-prev {
    left: 15px;
  }

  .lightbox-nav-next {
    right: 15px;
  }

  .lightbox-title {
    font-size: 20px;
  }

  .lightbox-description {
    font-size: 13px;
    padding: 12px 16px;
  }

  .lightbox-counter {
    font-size: 12px;
  }
}

@media (max-width: 450px) {
  .gallery-lightbox-container {
    width: 100%;
    max-width: 100vw;
    height: 100vh;
  }

  .lightbox-image-wrapper {
    height: calc(100% - 120px);
  }

  .lightbox-close-btn {
    width: 40px;
    height: 40px;
    top: 30px;
    right: 30px;
    font-size: 18px;
  }

  .lightbox-nav-btn {
    width: 44px;
    height: 44px;
    font-size: 20px;
  }

  .lightbox-nav-prev {
    left: 10px;
  }

  .lightbox-nav-next {
    right: 10px;
  }

  .lightbox-info {
    padding: 15px;
  }

  .lightbox-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .lightbox-description {
    font-size: 12px;
    padding: 10px 12px;
    margin-bottom: 10px;
  }
}
</style>
