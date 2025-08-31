# Foundry VTT Package Directory Submission Guide

## Roll Initiative 5e v1.0.0

This guide walks you through submitting **Roll Initiative 5e** to the official Foundry VTT package directory, which makes your module discoverable to most users through the in-app "Install Module" browser.

## 📋 Pre-Submission Checklist

### ✅ Repository Setup
- [x] **GitHub Repository**: `https://github.com/danshapiro/fvtt-module-roll-initiative`
- [x] **Public Repository**: Repository is publicly accessible
- [x] **License File**: MIT license included and properly referenced

### ✅ Module Files
- [x] **module.json**: Contains all required fields
- [x] **Main Script**: `roll-initiative-5e.js` - Core functionality
- [x] **Styles**: `styles/roll-initiative-5e.css` - Visual styling
- [x] **Assets**: `assets/` folder with 75+ artwork pieces and audio
- [x] **Documentation**: README.md, CHANGELOG.md, LICENSE

### ✅ Distribution Package
- [x] **ZIP File**: `roll-initiative-5e-v1.0.0.zip` created
- [x] **Package Contents**: All necessary files included
- [x] **File Size**: Optimized package (7.3 KB)

## 🚀 Submission Process

### Step 1: Create GitHub Release

1. **Tag the Release**: Create a Git tag for v1.0.0
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create GitHub Release**:
   - Go to GitHub repository → Releases → "Create a new release"
   - **Tag version**: `v1.0.0`
   - **Release title**: `Roll Initiative 5e v1.0.0 - Initial Release`
   - **Description**: Copy content from `RELEASE_NOTES_v1.0.0.md`
   - **Upload Assets**: Attach `roll-initiative-5e-v1.0.0.zip`

3. **Verify URLs**:
   - **Manifest URL**: `https://github.com/danshapiro/fvtt-module-roll-initiative/releases/latest/download/module.json`
   - **Download URL**: `https://github.com/danshapiro/fvtt-module-roll-initiative/releases/download/v1.0.0/roll-initiative-5e-v1.0.0.zip`

### Step 2: Foundry Package Submission

1. **Access Submission Form**:
   - Go to [Foundry VTT Package Submission Form](https://foundryvtt.com/article/package-submission/)
   - Requires active Foundry VTT license

2. **Fill Submission Form**:
   - **Package Name**: `Roll Initiative 5e`
   - **Package Type**: Module
   - **Repository URL**: `https://github.com/danshapiro/fvtt-module-roll-initiative`
   - **Description**: Brief description of functionality
   - **Compatibility**: Foundry v11+, D&D 5e system

3. **Submit for Review**: Manual review process (typically 1-3 business days)

### Step 3: Package Management

After approval, use the Package Management page to:

1. **Create Release Entry**:
   - **Version Number**: `1.0.0`
   - **Package Manifest URL**: `https://github.com/danshapiro/fvtt-module-roll-initiative/releases/latest/download/module.json`
   - **Release Notes URL**: `https://github.com/danshapiro/fvtt-module-roll-initiative/releases/tag/v1.0.0`
   - **Core Compatibility**: `11`

2. **Publish Release**: Makes module appear in in-app installer

## 🔍 Verification Steps

### Before Submission
- [ ] Test ZIP package installation in local Foundry instance
- [ ] Verify all assets load correctly
- [ ] Test module functionality end-to-end
- [ ] Check module.json syntax and URLs

### After Approval
- [ ] Verify module appears in Foundry's module browser
- [ ] Test installation from official directory
- [ ] Monitor for user feedback and issues
- [ ] Prepare for future updates

## 📊 Package Information

### Technical Details
- **Module ID**: `roll-initiative-5e`
- **Title**: Roll Initiative 5e
- **Version**: 1.0.0
- **Foundry Compatibility**: v11+
- **System Support**: dnd5e
- **Dependencies**: None

### Features Highlight
- One-click combat setup
- 75+ AI-generated artwork pieces
- Optional sound effects
- Smart PC/NPC management
- Performance optimized

### Target Audience
- D&D 5e GMs and players
- Foundry VTT v11+ users
- Groups seeking immersive combat experiences
- Users wanting streamlined combat preparation

## 🎯 Success Metrics

### Immediate Goals
- [ ] Successful submission to Foundry directory
- [ ] Module discoverable in in-app installer
- [ ] First user installations and feedback

### Long-term Goals
- [ ] Regular user base and community
- [ ] Positive ratings and reviews
- [ ] Feature requests and improvements
- [ ] Expansion to other game systems

## 📞 Support & Maintenance

### User Support
- **GitHub Issues**: Primary support channel
- **Documentation**: Comprehensive README and settings guide
- **Examples**: Included artwork and configuration examples

### Maintenance Plan
- **Bug Fixes**: Prompt response to critical issues
- **Feature Updates**: Regular enhancements based on user feedback
- **Compatibility**: Track Foundry VTT updates and maintain compatibility

---

**Ready for submission!** This module is fully prepared for the official Foundry VTT package directory and should provide an excellent user experience for D&D 5e players seeking enhanced combat initiation.
