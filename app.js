// Enhanced Presentation State Management with Google Sheets Integration

class PresentationController {
    constructor() {
        this.currentStage = 1;
        this.totalStages = 5;
        this.animationTimeouts = [];
        this.particleIntervals = [];
        this.documentTransitions = [];
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.updateProgressBar();
        this.startStageAnimations(1);
        this.initializeTooltips();
        this.initializeProblemSolutionFlow();
    }

    bindEventListeners() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStage());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStage());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());

        // Stage dots navigation
        document.querySelectorAll('.stage-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const stage = parseInt(e.target.dataset.stage);
                this.goToStage(stage);
            });
        });

        // Interactive elements
        this.bindInteractiveElements();

        // Add keyboard navigation
        this.setupKeyboardNavigation();
    }

    bindInteractiveElements() {
        // Stage 2: Search button
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.triggerHistoricalSearch());
        }

        // Stage 3: Load workspace button
        const loadWorkspaceBtn = document.getElementById('loadWorkspaceBtn');
        if (loadWorkspaceBtn) {
            loadWorkspaceBtn.addEventListener('click', () => this.triggerWorkspaceCreation());
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextStage();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevStage();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.restart();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.goToStage(1);
                    break;
            }
        });
    }

    nextStage() {
        if (this.currentStage < this.totalStages) {
            this.goToStage(this.currentStage + 1);
        }
    }

    prevStage() {
        if (this.currentStage > 1) {
            this.goToStage(this.currentStage - 1);
        }
    }

    goToStage(stage) {
        if (stage < 1 || stage > this.totalStages || stage === this.currentStage) {
            return;
        }

        // Clear existing animations
        this.clearAnimations();

        // Animate out current stage
        const currentStageEl = document.getElementById(`stage${this.currentStage}`);
        if (currentStageEl) {
            this.animateStageOut(currentStageEl);
        }

        // Update stage
        const previousStage = this.currentStage;
        this.currentStage = stage;

        // Show new stage with enhanced transition
        const newStageEl = document.getElementById(`stage${stage}`);
        if (newStageEl) {
            setTimeout(() => {
                this.animateStageIn(newStageEl, stage, previousStage);
                this.startStageAnimations(stage);
            }, 300);
        }

        // Update UI
        this.updateProgressBar();
        this.updateStageDots();
        this.updateNavigationButtons();
    }

    animateStageOut(element) {
        element.style.animation = 'stageSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            element.classList.remove('active');
        }, 300);
    }

    animateStageIn(element, stage, previousStage) {
        element.classList.add('active');
        
        // Determine animation direction
        const direction = stage > previousStage ? 'Right' : 'Left';
        element.style.animation = `stageSlideInFrom${direction} 0.5s ease-out forwards`;
        
        // Add dynamic styles for stage transitions
        const style = document.createElement('style');
        style.textContent = `
            @keyframes stageSlideOut {
                0% { opacity: 1; transform: translateX(0) scale(1); }
                100% { opacity: 0; transform: translateX(-100px) scale(0.95); }
            }
            
            @keyframes stageSlideInFromRight {
                0% { opacity: 0; transform: translateX(100px) rotateY(15deg) scale(0.95); }
                100% { opacity: 1; transform: translateX(0) rotateY(0deg) scale(1); }
            }
            
            @keyframes stageSlideInFromLeft {
                0% { opacity: 0; transform: translateX(-100px) rotateY(-15deg) scale(0.95); }
                100% { opacity: 1; transform: translateX(0) rotateY(0deg) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove style after animation
        setTimeout(() => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 500);
    }

    restart() {
        this.goToStage(1);
        // Reset all stage dots to inactive
        document.querySelectorAll('.stage-dot').forEach(dot => {
            dot.classList.remove('completed');
        });
        
        // Restart problem-solution flow
        this.initializeProblemSolutionFlow();
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        const progress = (this.currentStage / this.totalStages) * 100;
        progressFill.style.width = `${progress}%`;
    }

    updateStageDots() {
        document.querySelectorAll('.stage-dot').forEach((dot, index) => {
            const stageNum = index + 1;
            dot.classList.remove('active', 'completed');
            
            if (stageNum === this.currentStage) {
                dot.classList.add('active');
            } else if (stageNum < this.currentStage) {
                dot.classList.add('completed');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentStage === 1;
        
        if (this.currentStage === this.totalStages) {
            nextBtn.textContent = '🎉 Demo Complete!';
            nextBtn.disabled = true;
            nextBtn.classList.remove('primary');
            nextBtn.classList.add('secondary');
        } else {
            nextBtn.textContent = 'Next Stage ➡️';
            nextBtn.disabled = false;
            nextBtn.classList.add('primary');
            nextBtn.classList.remove('secondary');
        }
    }

    clearAnimations() {
        // Clear timeouts
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
        
        // Clear intervals
        this.particleIntervals.forEach(interval => clearInterval(interval));
        this.particleIntervals = [];
        
        // Clear document transitions
        this.documentTransitions.forEach(transition => clearTimeout(transition));
        this.documentTransitions = [];
        
        // Remove animation classes
        document.querySelectorAll('.processing, .syncing, .searching, .transforming').forEach(el => {
            el.classList.remove('processing', 'syncing', 'searching', 'transforming');
        });
    }

    initializeProblemSolutionFlow() {
        // Animate problem badges
        const problemBadge = document.querySelector('.problem-badge');
        const solutionBadge = document.querySelector('.solution-badge');
        
        if (problemBadge && solutionBadge) {
            setTimeout(() => {
                problemBadge.style.animation = 'badgeFloat 3s ease-in-out infinite';
            }, 500);
            
            setTimeout(() => {
                solutionBadge.style.animation = 'badgeFloat 3s ease-in-out infinite 1.5s';
            }, 1500);
        }
    }

    startStageAnimations(stage) {
        switch(stage) {
            case 1:
                this.animateStage1();
                break;
            case 2:
                this.animateStage2();
                break;
            case 3:
                this.animateStage3();
                break;
            case 4:
                this.animateStage4();
                break;
            case 5:
                this.animateStage5();
                break;
        }
    }

    animateStage1() {
        // Animate problem scenarios
        const scenarios = document.querySelectorAll('.scenario-card');
        scenarios.forEach((scenario, index) => {
            const timeout = setTimeout(() => {
                scenario.style.animation = `cardSlideUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                scenario.style.animationDelay = `${index * 0.2}s`;
            }, 300);
            this.animationTimeouts.push(timeout);
        });

        // Animate CRUD operations
        const crudItems = document.querySelectorAll('#stage1 .crud-item');
        crudItems.forEach((item, index) => {
            const timeout = setTimeout(() => {
                item.style.animation = `crudItemSlide 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                item.style.animationDelay = `${index * 0.2 + 0.5}s`;
            }, 500);
            this.animationTimeouts.push(timeout);
        });

        // Animate feature cards
        const featureCards = document.querySelectorAll('#stage1 .feature-card');
        featureCards.forEach((card, index) => {
            const timeout = setTimeout(() => {
                card.style.animation = `featureReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                card.style.animationDelay = `${index * 0.3 + 1}s`;
            }, 1000);
            this.animationTimeouts.push(timeout);
        });

        // Start performance indicators
        this.startPerformanceIndicators();
        
        // Document transformation effect
        this.startDocumentTransformation('#stage1');
    }

    animateStage2() {
        // Animate feature explanation steps
        const steps = document.querySelectorAll('#stage2 .feature-step');
        steps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                step.style.animation = `stepReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                step.style.animationDelay = `${index * 0.3}s`;
            }, 300);
            this.animationTimeouts.push(timeout);
        });

        // Animate benefits showcase
        const benefits = document.querySelectorAll('#stage2 .benefit-item');
        benefits.forEach((benefit, index) => {
            const timeout = setTimeout(() => {
                benefit.style.animation = `benefitReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                benefit.style.animationDelay = `${index * 0.2 + 0.8}s`;
            }, 800);
            this.animationTimeouts.push(timeout);
        });

        // Make search results initially hidden
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.opacity = '0';
            searchResults.style.transform = 'translateY(20px)';
        }
    }

    animateStage3() {
        // Animate process flow
        const flowSteps = document.querySelectorAll('#stage3 .flow-step');
        flowSteps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                step.style.animation = `processStepRise 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                step.style.animationDelay = `${index * 0.2}s`;
            }, 200);
            this.animationTimeouts.push(timeout);
        });

        // Start data flow particles
        this.startDataFlowParticles();

        // Animate technical benefits
        const techBenefits = document.querySelectorAll('#stage3 .tech-benefit');
        techBenefits.forEach((benefit, index) => {
            const timeout = setTimeout(() => {
                benefit.style.animation = `benefitReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                benefit.style.animationDelay = `${index * 0.2 + 1}s`;
            }, 1000);
            this.animationTimeouts.push(timeout);
        });
    }

    animateStage4() {
        // Animate editing workflow
        const workflowSteps = document.querySelectorAll('#stage4 .workflow-step');
        workflowSteps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                step.style.animation = `workflowSlideIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                step.style.animationDelay = `${index * 0.3}s`;
            }, 200);
            this.animationTimeouts.push(timeout);
        });

        // Animate edit operations
        const editItems = document.querySelectorAll('#stage4 .edit-item');
        editItems.forEach((item, index) => {
            const timeout = setTimeout(() => {
                item.style.animation = `editItemPulse 3s infinite`;
                item.style.animationDelay = `${index}s`;
            }, 1000);
            this.animationTimeouts.push(timeout);
        });

        // Animate editing capabilities
        const capabilities = document.querySelectorAll('#stage4 .capability-card');
        capabilities.forEach((capability, index) => {
            const timeout = setTimeout(() => {
                capability.style.animation = `benefitReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                capability.style.animationDelay = `${index * 0.2 + 1.5}s`;
            }, 1500);
            this.animationTimeouts.push(timeout);
        });

        // Show smooth experience indicator
        this.showSmoothExperienceIndicator();
    }

    animateStage5() {
        // Animate sync explanation
        const syncFeatures = document.querySelectorAll('#stage5 .sync-feature');
        syncFeatures.forEach((feature, index) => {
            const timeout = setTimeout(() => {
                feature.style.animation = `syncFeatureRise 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                feature.style.animationDelay = `${index * 0.3}s`;
            }, 300);
            this.animationTimeouts.push(timeout);
        });

        // Animate sync status items
        const statusItems = document.querySelectorAll('#stage5 .status-item');
        statusItems.forEach((item, index) => {
            const timeout = setTimeout(() => {
                item.style.animation = `statusItemSlide 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                item.style.animationDelay = `${(index + 1) * 1}s`;
            }, 1000);
            this.animationTimeouts.push(timeout);
        });

        // Start sync particles
        this.startSyncParticles();

        // Animate final benefits
        const finalBenefits = document.querySelectorAll('#stage5 .final-benefit');
        finalBenefits.forEach((benefit, index) => {
            const timeout = setTimeout(() => {
                benefit.style.animation = `benefitReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                benefit.style.animationDelay = `${index * 0.2 + 2}s`;
            }, 2000);
            this.animationTimeouts.push(timeout);
        });
    }

    startPerformanceIndicators() {
        const fastIndicator = document.querySelector('.performance-indicator.fast');
        const slowIndicator = document.querySelector('.performance-indicator.slow');
        
        if (fastIndicator) {
            const interval = setInterval(() => {
                fastIndicator.style.animation = 'none';
                fastIndicator.offsetHeight; // Trigger reflow
                fastIndicator.style.animation = '';
            }, 1000);
            this.particleIntervals.push(interval);
        }
        
        if (slowIndicator) {
            const interval = setInterval(() => {
                slowIndicator.style.animation = 'none';
                slowIndicator.offsetHeight; // Trigger reflow
                slowIndicator.style.animation = '';
            }, 3000);
            this.particleIntervals.push(interval);
        }
    }

    startDataFlowParticles() {
        const flowContainer = document.querySelector('#stage3 .flow-particles');
        if (!flowContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: linear-gradient(45deg, #9c27b0, #673ab7);
                border-radius: 50%;
                left: 10%;
                top: 50%;
                transform: translateY(-50%);
                box-shadow: 0 0 10px rgba(156, 39, 176, 0.5);
                pointer-events: none;
                z-index: 10;
            `;
            
            // Create trail effect
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: absolute;
                width: 50px;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(156, 39, 176, 0.5), transparent);
                left: -25px;
                top: 4px;
                border-radius: 1px;
            `;
            particle.appendChild(trail);
            
            flowContainer.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { left: '10%', opacity: 1, transform: 'translateY(-50%) scale(1)' },
                { left: '50%', opacity: 1, transform: 'translateY(-50%) scale(1.2)' },
                { left: '90%', opacity: 0, transform: 'translateY(-50%) scale(0.8)' }
            ], {
                duration: 2500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        };

        const interval = setInterval(createParticle, 600);
        this.particleIntervals.push(interval);
    }

    startSyncParticles() {
        const syncContainer = document.querySelector('#stage5 .sync-particles');
        if (!syncContainer) return;

        const createSyncParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: linear-gradient(45deg, #0f9d58, #00c851);
                border-radius: 50%;
                right: 10%;
                top: 30%;
                box-shadow: 0 0 8px rgba(15, 157, 88, 0.6);
                pointer-events: none;
                z-index: 10;
            `;
            
            syncContainer.appendChild(particle);
            
            // Animate sync particle
            particle.animate([
                { right: '10%', top: '30%', opacity: 1, transform: 'scale(1)' },
                { right: '50%', top: '50%', opacity: 1, transform: 'scale(1.5)' },
                { right: '90%', top: '70%', opacity: 0, transform: 'scale(0.8)' }
            ], {
                duration: 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        };

        const interval = setInterval(createSyncParticle, 400);
        this.particleIntervals.push(interval);
    }

    startDocumentTransformation(stageSelector) {
        const stage = document.querySelector(stageSelector);
        if (!stage) return;
        
        // Create floating document icons
        const createDocument = () => {
            const doc = document.createElement('div');
            doc.style.cssText = `
                position: absolute;
                font-size: 20px;
                opacity: 0.6;
                pointer-events: none;
                z-index: 1;
                color: rgba(33, 128, 141, 0.6);
            `;
            doc.textContent = '📄';
            
            // Random position
            const x = Math.random() * (stage.offsetWidth - 20);
            const y = Math.random() * (stage.offsetHeight - 20);
            doc.style.left = x + 'px';
            doc.style.top = y + 'px';
            
            stage.appendChild(doc);
            
            // Animate document
            doc.animate([
                { opacity: 0, transform: 'scale(0.5) rotate(0deg)' },
                { opacity: 0.6, transform: 'scale(1) rotate(180deg)' },
                { opacity: 0, transform: 'scale(0.8) rotate(360deg)' }
            ], {
                duration: 4000,
                easing: 'ease-in-out'
            }).onfinish = () => {
                if (doc.parentNode) {
                    doc.parentNode.removeChild(doc);
                }
            };
        };
        
        // Create documents periodically
        const timeout = setTimeout(() => {
            createDocument();
            const interval = setInterval(createDocument, 2000);
            this.particleIntervals.push(interval);
        }, 1000);
        
        this.documentTransitions.push(timeout);
    }

    triggerHistoricalSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');
        
        if (searchBtn && searchResults) {
            // Animate button state
            searchBtn.textContent = '🔍 Searching BigQuery...';
            searchBtn.disabled = true;
            searchBtn.style.background = 'linear-gradient(45deg, #ea4335, #ff6b6b)';
            
            // Show loading effect
            searchResults.style.opacity = '0.3';
            searchResults.style.filter = 'blur(2px)';
            
            const timeout1 = setTimeout(() => {
                // Update button
                searchBtn.textContent = '📊 Processing Results...';
                searchBtn.style.background = 'linear-gradient(45deg, #f39c12, #f1c40f)';
            }, 1000);
            
            const timeout2 = setTimeout(() => {
                // Show results
                searchBtn.textContent = '✅ Historical Data Found!';
                searchBtn.style.background = 'linear-gradient(45deg, #0f9d58, #00c851)';
                searchBtn.disabled = false;
                
                searchResults.style.opacity = '1';
                searchResults.style.filter = 'blur(0px)';
                searchResults.style.transform = 'translateY(0)';
                searchResults.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                // Animate result items
                const resultItems = searchResults.querySelectorAll('.result-item');
                resultItems.forEach((item, index) => {
                    const itemTimeout = setTimeout(() => {
                        item.style.animation = `resultSlideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                        item.style.animationDelay = `${index * 0.2}s`;
                    }, 300);
                    this.animationTimeouts.push(itemTimeout);
                });
            }, 2500);
            
            this.animationTimeouts.push(timeout1, timeout2);
        }
    }

    triggerWorkspaceCreation() {
        const loadBtn = document.getElementById('loadWorkspaceBtn');
        const cloudFunction = document.getElementById('cloudFunction');
        const tempTable = document.getElementById('tempTable');
        
        if (loadBtn && cloudFunction && tempTable) {
            // Stage 1: Button clicked
            loadBtn.classList.add('clicked');
            loadBtn.textContent = '⚙️ Initializing Cloud Function...';
            loadBtn.disabled = true;
            loadBtn.style.background = 'linear-gradient(45deg, #f39c12, #f1c40f)';
            
            const timeout1 = setTimeout(() => {
                // Stage 2: Cloud Function processing
                cloudFunction.style.transform = 'scale(1.1)';
                cloudFunction.style.borderColor = '#9c27b0';
                cloudFunction.style.boxShadow = '0 0 30px rgba(156, 39, 176, 0.5)';
                
                loadBtn.textContent = '📊 Processing BigQuery Data...';
                loadBtn.style.background = 'linear-gradient(45deg, #ea4335, #ff6b6b)';
                
                // Add processing particles around cloud function
                this.createProcessingParticles(cloudFunction);
            }, 800);
            
            const timeout2 = setTimeout(() => {
                // Stage 3: Creating workspace
                loadBtn.textContent = '📝 Creating Google Sheets Workspace...';
                loadBtn.style.background = 'linear-gradient(45deg, #0f9d58, #4285f4)';
                
                tempTable.style.opacity = '1';
                tempTable.style.transform = 'scale(1)';
                tempTable.classList.add('active');
            }, 2200);
            
            const timeout3 = setTimeout(() => {
                // Stage 4: Complete
                loadBtn.textContent = '🎉 Workspace Ready for Editing!';
                loadBtn.style.background = 'linear-gradient(45deg, #0f9d58, #00c851)';
                
                // Animate workspace features
                const workspaceFeatures = tempTable.querySelectorAll('.workspace-feature');
                workspaceFeatures.forEach((feature, index) => {
                    const featureTimeout = setTimeout(() => {
                        feature.style.animation = `workspaceFeatureSlide 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
                        feature.style.animationDelay = `${index * 0.3}s`;
                    }, 500);
                    this.animationTimeouts.push(featureTimeout);
                });
            }, 3500);
            
            this.animationTimeouts.push(timeout1, timeout2, timeout3);
        }
    }

    createProcessingParticles(container) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #9c27b0, #673ab7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 15;
                box-shadow: 0 0 10px rgba(156, 39, 176, 0.8);
            `;
            
            // Random position around container
            const angle = Math.random() * 2 * Math.PI;
            const radius = 60;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            particle.style.left = `calc(50% + ${x}px)`;
            particle.style.top = `calc(50% + ${y}px)`;
            
            container.appendChild(particle);
            
            // Animate particle spiraling into center
            particle.animate([
                { 
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    opacity: 1,
                    transform: 'scale(1)'
                },
                { 
                    left: '50%',
                    top: '50%',
                    opacity: 0,
                    transform: 'scale(0.5)'
                }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        };
        
        // Create multiple particles
        for (let i = 0; i < 8; i++) {
            const timeout = setTimeout(createParticle, i * 200);
            this.animationTimeouts.push(timeout);
        }
    }

    showSmoothExperienceIndicator() {
        const indicator = document.querySelector('#stage4 .smooth-experience-indicator');
        if (indicator) {
            const timeout = setTimeout(() => {
                indicator.style.animation = 'experienceSlideIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            }, 2000);
            this.animationTimeouts.push(timeout);
        }
    }

    initializeTooltips() {
        const tooltip = document.getElementById('tooltip');
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const text = e.target.getAttribute('data-tooltip');
                if (text && tooltip) {
                    tooltip.querySelector('.tooltip-content').textContent = text;
                    tooltip.classList.add('show');
                    
                    const rect = e.target.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    
                    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                    let top = rect.top - tooltipRect.height - 10;
                    
                    // Ensure tooltip stays within viewport
                    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
                    top = Math.max(10, top);
                    
                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.classList.remove('show');
                }
            });
        });
    }
}

// Enhanced Animation System
class EnhancedAnimationSystem {
    constructor() {
        this.activeAnimations = new Map();
        this.animationQueue = [];
        this.performanceObserver = null;
        this.initializePerformanceMonitoring();
    }

    initializePerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log(`Animation "${entry.name}" took ${entry.duration}ms`);
                    }
                });
            });
            this.performanceObserver.observe({ entryTypes: ['measure'] });
        }
    }

    createComplexAnimation(element, keyframes, options = {}) {
        const animationId = `animation-${Date.now()}-${Math.random()}`;
        
        performance.mark(`${animationId}-start`);
        
        const animation = element.animate(keyframes, {
            duration: 1000,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            fill: 'forwards',
            ...options
        });
        
        animation.addEventListener('finish', () => {
            performance.mark(`${animationId}-end`);
            performance.measure(animationId, `${animationId}-start`, `${animationId}-end`);
            this.activeAnimations.delete(animationId);
        });
        
        this.activeAnimations.set(animationId, animation);
        return animation;
    }

    createStaggeredAnimations(elements, keyframes, baseOptions = {}) {
        const animations = [];
        
        elements.forEach((element, index) => {
            const staggerDelay = (baseOptions.staggerDelay || 100) * index;
            const options = {
                ...baseOptions,
                delay: staggerDelay
            };
            
            const animation = this.createComplexAnimation(element, keyframes, options);
            animations.push(animation);
        });
        
        return animations;
    }

    createMorphingAnimation(element, shapes, options = {}) {
        const keyframes = shapes.map((shape, index) => ({
            clipPath: shape,
            offset: index / (shapes.length - 1)
        }));
        
        return this.createComplexAnimation(element, keyframes, options);
    }

    clearAllAnimations() {
        this.activeAnimations.forEach(animation => animation.cancel());
        this.activeAnimations.clear();
    }
}

// Feature Explanation System
class FeatureExplanationSystem {
    constructor() {
        this.explanations = new Map();
        this.currentExplanation = null;
        this.setupExplanationData();
    }

    setupExplanationData() {
        this.explanations.set('google-sheets', {
            title: 'Google Sheets Integration',
            points: [
                'Real-time collaboration with team members',
                'Familiar interface for data entry and editing',
                'Automatic saving and version history',
                'Mobile-first design with AppSheet integration',
                'Powerful formulas and data validation'
            ],
            benefits: [
                'Lightning-fast CRUD operations',
                'Zero learning curve for users',
                'Built-in sharing and permissions'
            ]
        });

        this.explanations.set('bigquery', {
            title: 'BigQuery Data Warehouse',
            points: [
                'Massive scale data storage and analytics',
                'SQL-based querying with sub-second response',
                'Automatic data partitioning and optimization',
                'Machine learning integration',
                'Pay-per-query cost model'
            ],
            benefits: [
                'Handle petabytes of historical data',
                'Complex analytical queries',
                'Enterprise-grade security'
            ]
        });

        this.explanations.set('cloud-functions', {
            title: 'Cloud Functions ETL',
            points: [
                'Serverless data processing',
                'Automatic scaling based on demand',
                'Event-driven data transformations',
                'Built-in monitoring and logging',
                'Cost-effective processing'
            ],
            benefits: [
                'No infrastructure management',
                'Millisecond response times',
                'Seamless data flow'
            ]
        });
    }

    showExplanation(feature, element) {
        const explanation = this.explanations.get(feature);
        if (!explanation) return;

        this.currentExplanation = this.createExplanationPopup(explanation, element);
    }

    createExplanationPopup(explanation, targetElement) {
        const popup = document.createElement('div');
        popup.className = 'feature-explanation-popup';
        popup.innerHTML = `
            <div class="explanation-header">
                <h4>${explanation.title}</h4>
                <button class="close-explanation">✕</button>
            </div>
            <div class="explanation-content">
                <div class="explanation-points">
                    <h5>Key Features:</h5>
                    <ul>
                        ${explanation.points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                <div class="explanation-benefits">
                    <h5>Benefits:</h5>
                    <ul>
                        ${explanation.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Position popup
        const rect = targetElement.getBoundingClientRect();
        popup.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 10}px;
            left: ${rect.left}px;
            background: var(--color-surface);
            border: 2px solid var(--color-primary);
            border-radius: var(--radius-lg);
            padding: var(--space-20);
            max-width: 400px;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
            transform: scale(0.8) translateY(-20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        document.body.appendChild(popup);

        // Animate in
        requestAnimationFrame(() => {
            popup.style.transform = 'scale(1) translateY(0)';
            popup.style.opacity = '1';
        });

        // Close button
        popup.querySelector('.close-explanation').addEventListener('click', () => {
            this.closeExplanation(popup);
        });

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                this.closeExplanation(popup);
            }
        }, 10000);

        return popup;
    }

    closeExplanation(popup) {
        popup.style.transform = 'scale(0.8) translateY(-20px)';
        popup.style.opacity = '0';
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }
}

// Problem-Solution Flow Manager
class ProblemSolutionFlowManager {
    constructor() {
        this.problems = [];
        this.solutions = [];
        this.currentFlow = null;
        this.setupFlowData();
    }

    setupFlowData() {
        this.problems = [
            {
                title: 'Data Silos',
                description: 'Live and historical data trapped in separate systems',
                impact: 'Poor decision making, incomplete insights'
            },
            {
                title: 'Slow Historical Queries',
                description: 'Traditional databases struggle with large historical datasets',
                impact: 'Delayed analysis, frustrated users'
            },
            {
                title: 'Complex Data Workflows',
                description: 'Moving data between systems requires technical expertise',
                impact: 'Dependencies on IT, slower business processes'
            }
        ];

        this.solutions = [
            {
                title: 'Unified Data Architecture',
                description: 'Google Sheets + BigQuery integration',
                benefit: 'Single source of truth for all data needs'
            },
            {
                title: 'Optimized Query Performance',
                description: 'BigQuery\'s columnar storage and processing power',
                benefit: 'Sub-second responses on massive datasets'
            },
            {
                title: 'Seamless User Experience',
                description: 'Familiar tools with powerful backend integration',
                benefit: 'No training needed, maximum productivity'
            }
        ];
    }

    animateProblemSolutionFlow(container) {
        const flowElement = this.createFlowVisualization();
        container.appendChild(flowElement);
        
        this.startFlowAnimation(flowElement);
    }

    createFlowVisualization() {
        const flow = document.createElement('div');
        flow.className = 'problem-solution-flow';
        flow.innerHTML = `
            <div class="flow-problems">
                ${this.problems.map((problem, index) => `
                    <div class="problem-card" data-index="${index}">
                        <div class="problem-icon">❌</div>
                        <h4>${problem.title}</h4>
                        <p>${problem.description}</p>
                        <div class="impact">${problem.impact}</div>
                    </div>
                `).join('')}
            </div>
            <div class="flow-arrow">
                <div class="arrow-body">→</div>
                <div class="arrow-label">Our Solution</div>
            </div>
            <div class="flow-solutions">
                ${this.solutions.map((solution, index) => `
                    <div class="solution-card" data-index="${index}">
                        <div class="solution-icon">✅</div>
                        <h4>${solution.title}</h4>
                        <p>${solution.description}</p>
                        <div class="benefit">${solution.benefit}</div>
                    </div>
                `).join('')}
            </div>
        `;

        return flow;
    }

    startFlowAnimation(flowElement) {
        const problemCards = flowElement.querySelectorAll('.problem-card');
        const solutionCards = flowElement.querySelectorAll('.solution-card');
        const arrow = flowElement.querySelector('.flow-arrow');

        // Animate problems first
        problemCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'problemSlideIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            }, index * 300);
        });

        // Then arrow
        setTimeout(() => {
            arrow.style.animation = 'arrowExpand 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        }, problemCards.length * 300 + 500);

        // Finally solutions
        setTimeout(() => {
            solutionCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'solutionSlideIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                }, index * 300);
            });
        }, problemCards.length * 300 + 1500);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Create main controller
    const presentationController = new PresentationController();
    
    // Initialize enhanced systems
    const animationSystem = new EnhancedAnimationSystem();
    const featureExplanationSystem = new FeatureExplanationSystem();
    const problemSolutionFlowManager = new ProblemSolutionFlowManager();

    // Add feature explanation triggers
    document.querySelectorAll('.data-store').forEach(store => {
        store.addEventListener('click', (e) => {
            if (store.classList.contains('sheets')) {
                featureExplanationSystem.showExplanation('google-sheets', store);
            } else if (store.classList.contains('bigquery')) {
                featureExplanationSystem.showExplanation('bigquery', store);
            }
        });
    });

    document.querySelectorAll('.cloud-function').forEach(func => {
        func.addEventListener('click', (e) => {
            featureExplanationSystem.showExplanation('cloud-functions', func);
        });
    });

    // Add accessibility enhancements
    document.addEventListener('focusin', (e) => {
        if (e.target.classList.contains('nav-btn') || e.target.classList.contains('stage-dot')) {
            e.target.style.outline = '3px solid var(--color-focus-ring)';
            e.target.style.outlineOffset = '2px';
        }
    });

    document.addEventListener('focusout', (e) => {
        if (e.target.classList.contains('nav-btn') || e.target.classList.contains('stage-dot')) {
            e.target.style.outline = '';
            e.target.style.outlineOffset = '';
        }
    });

    // Handle window resize for responsive animations
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            presentationController.startStageAnimations(presentationController.currentStage);
        }, 250);
    });

    // Add custom CSS for dynamic animations
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        .feature-explanation-popup {
            animation: popupSlideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        @keyframes popupSlideIn {
            from {
                transform: scale(0.8) translateY(-20px);
                opacity: 0;
            }
            to {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }
        
        .problem-solution-flow {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: var(--space-32);
            align-items: center;
            margin: var(--space-40) 0;
        }
        
        .problem-card, .solution-card {
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            padding: var(--space-20);
            box-shadow: var(--shadow-md);
            margin-bottom: var(--space-16);
            opacity: 0;
            transform: translateX(-50px);
        }
        
        .solution-card {
            transform: translateX(50px);
        }
        
        @keyframes problemSlideIn {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes solutionSlideIn {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes arrowExpand {
            from {
                opacity: 0;
                transform: scaleX(0);
            }
            to {
                opacity: 1;
                transform: scaleX(1);
            }
        }
        
        .flow-arrow {
            text-align: center;
            font-size: var(--font-size-2xl);
            color: var(--color-primary);
            opacity: 0;
            transform: scaleX(0);
        }
        
        .arrow-label {
            font-size: var(--font-size-sm);
            margin-top: var(--space-8);
            font-weight: var(--font-weight-medium);
        }
    `;
    document.head.appendChild(dynamicStyles);

    // Expose controllers for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.presentationController = presentationController;
        window.animationSystem = animationSystem;
        window.featureExplanationSystem = featureExplanationSystem;
    }

    console.log('🚀 Enhanced Google Sheets + BigQuery Presentation Initialized!');
    console.log('Features: Advanced animations, problem-solution flow, interactive explanations');
    console.log('Navigation: Arrow keys, space bar, mouse, or touch gestures');
});
