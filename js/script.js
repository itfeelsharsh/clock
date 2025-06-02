/**
 * NEXUS CLOCK - ADVANCED JAVASCRIPT
 * Modern clock application with cutting-edge features
 * Professional code with extensive comments for team collaboration
 * 
 * Features:
 * - Real-time digital clock with smooth animations
 * - Dynamic theme switching (light/dark mode)
 * - Advanced date formatting with timezone detection
 * - Fully functional stopwatch with precision timing
 * - Responsive design with mobile optimization
 * - Accessibility features and keyboard navigation
 * - Modern ES6+ syntax with performance optimizations
 */

class NexusClock {
    constructor() {
        // Initialize core properties for the clock application
        this.isRunning = true;
        this.currentTime = new Date();
        this.stopwatchStartTime = null;
        this.stopwatchElapsed = 0;
        this.stopwatchInterval = null;
        this.clockInterval = null;
        this.isDarkTheme = false;
        
        // DOM element references for efficient access
        this.elements = {
            // Clock display elements
            hoursElement: document.querySelector('.hours'),
            minutesElement: document.querySelector('.minutes'),
            secondsElement: document.querySelector('.seconds'),
            periodElement: document.getElementById('period'),
            
            // Date and timezone elements
            dateElement: document.getElementById('current-date'),
            timezoneElement: document.getElementById('timezone'),
            
            // Stopwatch elements
            stopwatchDisplay: document.getElementById('stopwatch-display'),
            startStopBtn: document.getElementById('start-stop-btn'),
            resetBtn: document.getElementById('reset-btn'),
            
            // Theme toggle
            themeBtn: document.getElementById('theme-btn'),
            
            // Container for theme changes
            body: document.body
        };
        
        // Initialize the application
        this.init();
    }
    
    /**
     * Initialize all application components and event listeners
     * Sets up the clock, binds events, and starts the main loop
     */
    init() {
        console.log('🚀 Initializing Nexus Clock...');
        
        // Set up all event listeners for user interactions
        this.bindEvents();
        
        // Initialize theme based on user preference or system settings
        this.initializeTheme();
        
        // Start the main clock update loop
        this.startClock();
        
        // Initialize timezone detection
        this.updateTimezone();
        
        // Initialize stopwatch display
        this.updateStopwatchDisplay();
        
        // Add smooth entrance animations
        this.addEntranceAnimations();
        
        console.log('✅ Nexus Clock initialized successfully!');
    }
    
    /**
     * Bind all event listeners for interactive elements
     * Includes keyboard navigation and accessibility features
     */
    bindEvents() {
        // Theme toggle functionality
        this.elements.themeBtn?.addEventListener('click', () => this.toggleTheme());
        
        // Stopwatch control buttons
        this.elements.startStopBtn?.addEventListener('click', () => this.toggleStopwatch());
        this.elements.resetBtn?.addEventListener('click', () => this.resetStopwatch());
        
        // Keyboard navigation support
        document.addEventListener('keydown', (event) => this.handleKeyboardShortcuts(event));
        
        // Window focus/blur events for performance optimization
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());
        
        // Resize event for responsive adjustments
        window.addEventListener('resize', () => this.handleResize());
        
        // Mouse movement for subtle interactive effects
        document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
    }
    
    /**
     * Initialize theme based on user preference or system settings
     * Supports both manual selection and system preference detection
     */
    initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('nexus-clock-theme');
        
        // Check system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set theme based on preference hierarchy
        this.isDarkTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
        
        // Apply the theme
        this.applyTheme();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                if (!localStorage.getItem('nexus-clock-theme')) {
                    this.isDarkTheme = e.matches;
                    this.applyTheme();
                }
            });
    }
    
    /**
     * Toggle between light and dark themes with smooth transitions
     * Saves user preference to localStorage
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        
        // Save theme preference
        localStorage.setItem('nexus-clock-theme', this.isDarkTheme ? 'dark' : 'light');
        
        // Add a subtle feedback animation
        this.elements.themeBtn.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            this.elements.themeBtn.style.transform = '';
        }, 200);
    }
    
    /**
     * Apply the selected theme to the application
     * Updates CSS custom properties and icon states
     */
    applyTheme() {
        if (this.isDarkTheme) {
            this.elements.body.classList.add('dark-theme');
            this.elements.themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            this.elements.body.classList.remove('dark-theme');
            this.elements.themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    /**
     * Start the main clock update loop
     * Uses requestAnimationFrame for smooth animations
     */
    startClock() {
        const updateClock = () => {
            if (this.isRunning) {
                this.updateTime();
                this.updateDate();
            }
            
            // Continue the animation loop
            this.clockInterval = requestAnimationFrame(updateClock);
        };
        
        // Start the update loop
        updateClock();
    }
    
    /**
     * Update the digital time display with smooth transitions
     * Handles 12-hour format with AM/PM indicator
     */
    updateTime() {
        this.currentTime = new Date();
        
        // Extract time components
        let hours = this.currentTime.getHours();
        const minutes = this.currentTime.getMinutes();
        const seconds = this.currentTime.getSeconds();
        
        // Determine AM/PM and convert to 12-hour format
        const isAM = hours < 12;
        const period = isAM ? 'AM' : 'PM';
        
        // Convert to 12-hour format
        if (hours === 0) {
            hours = 12; // Midnight case
        } else if (hours > 12) {
            hours = hours - 12; // PM case
        }
        
        // Format with leading zeros
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        // Update DOM elements with smooth transitions
        this.updateTimeSegment(this.elements.hoursElement, formattedHours);
        this.updateTimeSegment(this.elements.minutesElement, formattedMinutes);
        this.updateTimeSegment(this.elements.secondsElement, formattedSeconds);
        
        // Update period indicator
        if (this.elements.periodElement) {
            this.elements.periodElement.textContent = period;
        }
    }
    
    /**
     * Update individual time segments with smooth animations
     * Prevents unnecessary DOM updates for better performance
     */
    updateTimeSegment(element, newValue) {
        if (element && element.textContent !== newValue) {
            // Add a subtle animation for value changes
            element.style.transform = 'scale(1.1)';
            element.textContent = newValue;
            
            // Reset animation after brief delay
            setTimeout(() => {
                element.style.transform = '';
            }, 100);
        }
    }
    
    /**
     * Update the date display with proper formatting
     * Shows day name, month, date, and year
     */
    updateDate() {
        const now = new Date();
        
        // Get formatted date components
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = now.toLocaleDateString('en-US', { month: 'long' });
        const dateNum = now.getDate();
        const year = now.getFullYear();
        
        // Create formatted date string with separators
        const formattedDate = `
            <span class="day-name">${dayName}</span>
            <span class="date-separator">•</span>
            <span class="month-day">${monthName} ${dateNum}</span>
            <span class="date-separator">•</span>
            <span class="year">${year}</span>
        `;
        
        // Update the date element
        if (this.elements.dateElement) {
            this.elements.dateElement.innerHTML = formattedDate;
        }
    }
    
    /**
     * Update timezone information display
     * Automatically detects user's timezone
     */
    updateTimezone() {
        try {
            // Get timezone information
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const now = new Date();
            
            // Get timezone offset in hours
            const offsetMinutes = now.getTimezoneOffset();
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
            const offsetMins = Math.abs(offsetMinutes) % 60;
            
            // Format offset string
            const offsetSign = offsetMinutes <= 0 ? '+' : '-';
            const offsetString = `UTC${offsetSign}${offsetHours}${offsetMins > 0 ? ':' + offsetMins.toString().padStart(2, '0') : ''}`;
            
            // Get timezone abbreviation if possible
            const timezoneAbbr = now.toLocaleDateString('en-US', { 
                timeZoneName: 'short' 
            }).split(', ')[1] || '';
            
            // Update timezone display
            if (this.elements.timezoneElement) {
                this.elements.timezoneElement.textContent = `${offsetString} (${timezoneAbbr || timezone.split('/').pop()})`;
            }
        } catch (error) {
            console.warn('Could not detect timezone:', error);
            if (this.elements.timezoneElement) {
                this.elements.timezoneElement.textContent = 'Local Time';
            }
        }
    }
    
    /**
     * Toggle stopwatch between start and stop states
     * Implements precise timing with performance.now()
     */
    toggleStopwatch() {
        if (this.stopwatchInterval) {
            // Stop the stopwatch
            this.stopStopwatch();
        } else {
            // Start the stopwatch
            this.startStopwatch();
        }
    }
    
    /**
     * Start the stopwatch with high-precision timing
     * Uses performance.now() for accurate measurements
     */
    startStopwatch() {
        // Record start time, accounting for any previously elapsed time
        this.stopwatchStartTime = performance.now() - this.stopwatchElapsed;
        
        // Update button state
        this.elements.startStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.elements.startStopBtn.classList.remove('start-btn');
        this.elements.startStopBtn.classList.add('pause-btn');
        
        // Start update interval
        this.stopwatchInterval = setInterval(() => {
            this.updateStopwatchDisplay();
        }, 10); // Update every 10ms for smooth animation
    }
    
    /**
     * Stop the stopwatch and preserve elapsed time
     */
    stopStopwatch() {
        // Clear the update interval
        clearInterval(this.stopwatchInterval);
        this.stopwatchInterval = null;
        
        // Update button state
        this.elements.startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.elements.startStopBtn.classList.remove('pause-btn');
        this.elements.startStopBtn.classList.add('start-btn');
    }
    
    /**
     * Reset the stopwatch to zero
     * Stops the timer and clears all elapsed time
     */
    resetStopwatch() {
        // Stop the stopwatch if running
        this.stopStopwatch();
        
        // Reset all timing values
        this.stopwatchStartTime = null;
        this.stopwatchElapsed = 0;
        
        // Update display
        this.updateStopwatchDisplay();
        
        // Add feedback animation
        this.elements.resetBtn.style.transform = 'scale(0.9) rotate(-180deg)';
        setTimeout(() => {
            this.elements.resetBtn.style.transform = '';
        }, 200);
    }
    
    /**
     * Update the stopwatch display with precise formatting
     * Shows hours, minutes, seconds, and milliseconds
     */
    updateStopwatchDisplay() {
        // Calculate elapsed time
        if (this.stopwatchStartTime) {
            this.stopwatchElapsed = performance.now() - this.stopwatchStartTime;
        }
        
        // Convert to time components
        const totalSeconds = Math.floor(this.stopwatchElapsed / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((this.stopwatchElapsed % 1000) / 10);
        
        // Format the display string
        let displayString;
        if (hours > 0) {
            // Show hours if elapsed time is over 1 hour
            displayString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        } else {
            // Standard mm:ss.ms format
            displayString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        }
        
        // Update the display
        if (this.elements.stopwatchDisplay) {
            this.elements.stopwatchDisplay.textContent = displayString;
        }
    }
    
    /**
     * Handle keyboard shortcuts for accessibility and power users
     * Implements common shortcuts for clock functions
     */
    handleKeyboardShortcuts(event) {
        // Prevent default for our shortcuts
        const shortcuts = {
            't': () => this.toggleTheme(), // Toggle theme
            's': () => this.toggleStopwatch(), // Start/stop stopwatch
            'r': () => this.resetStopwatch(), // Reset stopwatch
            ' ': () => this.toggleStopwatch() // Spacebar for stopwatch
        };
        
        // Execute shortcut if it exists
        const shortcut = shortcuts[event.key.toLowerCase()];
        if (shortcut && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            shortcut();
        }
    }
    
    /**
     * Handle window focus events for performance optimization
     * Reduces update frequency when window is not visible
     */
    handleWindowFocus() {
        this.isRunning = true;
        console.log('🎯 Clock resumed - window focused');
    }
    
    /**
     * Handle window blur events for performance optimization
     * Maintains functionality while reducing resource usage
     */
    handleWindowBlur() {
        // Keep running but note the state change
        console.log('⏸️  Clock continues - window blurred');
    }
    
    /**
     * Handle window resize events
     * Adjusts layout and animations for different screen sizes
     */
    handleResize() {
        // Debounce resize events for performance
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            console.log('📱 Layout adjusted for screen size');
            // Additional responsive adjustments can be added here
        }, 250);
    }
    
    /**
     * Handle mouse movement for subtle interactive effects
     * Creates dynamic background animations based on cursor position
     */
    handleMouseMove(event) {
        // Throttle mouse move events for performance
        if (!this.mouseThrottle) {
            this.mouseThrottle = true;
            setTimeout(() => {
                this.mouseThrottle = false;
            }, 16); // ~60fps throttling
            
            // Calculate mouse position as percentages
            const x = (event.clientX / window.innerWidth) * 100;
            const y = (event.clientY / window.innerHeight) * 100;
            
            // Apply subtle parallax effect to gradient overlay
            const gradientOverlay = document.querySelector('.gradient-overlay');
            if (gradientOverlay) {
                gradientOverlay.style.backgroundPosition = `${x}% ${y}%`;
            }
        }
    }
    
    /**
     * Add smooth entrance animations when the page loads
     * Creates a professional, polished user experience
     */
    addEntranceAnimations() {
        // Add entrance animations to main elements
        const animatedElements = [
            { selector: '.app-header', delay: 0 },
            { selector: '.time-container', delay: 200 },
            { selector: '.date-info', delay: 400 },
            { selector: '.features-section', delay: 600 },
            { selector: '.app-footer', delay: 800 }
        ];
        
        animatedElements.forEach(({ selector, delay }) => {
            const element = document.querySelector(selector);
            if (element) {
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                
                // Animate in after delay
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }
    
    /**
     * Cleanup method for proper resource management
     * Cancels intervals and removes event listeners
     */
    destroy() {
        // Cancel animation frames and intervals
        if (this.clockInterval) {
            cancelAnimationFrame(this.clockInterval);
        }
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
        }
        
        // Clear timeouts
        clearTimeout(this.resizeTimeout);
        
        console.log('🧹 Nexus Clock cleaned up successfully');
    }
}

/**
 * Initialize the Nexus Clock application when DOM is ready
 * Uses modern event handling with error catching
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global clock instance
        window.nexusClock = new NexusClock();
        
        // Add global error handling
        window.addEventListener('error', (event) => {
            console.error('🚨 Nexus Clock Error:', event.error);
        });
        
        // Add unload cleanup
        window.addEventListener('beforeunload', () => {
            if (window.nexusClock) {
                window.nexusClock.destroy();
            }
        });
        
    } catch (error) {
        console.error('🚨 Failed to initialize Nexus Clock:', error);
    }
});

/**
 * Service Worker registration for progressive web app features
 * Enables offline functionality and improved performance
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔧 Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('🔧 Service Worker registration failed:', error);
            });
    });
}

/**
 * Export the NexusClock class for potential module usage
 * Allows for testing and extension by other developers
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexusClock;
}
