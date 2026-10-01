// Labels, Navigations, and UI Definitions
const AppLabels = {
  publicNav: [
    { label: 'Home', href: '#hero', icon: 'home' },
    { label: 'About', href: '#about', icon: 'user' },
    { label: 'Skills', href: '#skills', icon: 'cpu' },
    { label: 'Projects', href: '#projects', icon: 'folder-git-2' },
    { label: 'Experience', href: '#experience', icon: 'briefcase' },
    { label: 'Education', href: '#education', icon: 'graduation-cap' },
    { label: 'Contact', href: '#contact', icon: 'mail' }
  ],

  adminNav: [
    { name: 'Dashboard', path: '/admin', icon: 'layout-dashboard' },
    { name: 'Profile', path: '/admin/profile', icon: 'user' },
    { name: 'Projects', path: '/admin/projects', icon: 'folder-git-2' },
    { name: 'Skills', path: '/admin/skills', icon: 'cpu' },
    { name: 'Experience', path: '/admin/experience', icon: 'briefcase' },
    { name: 'Education', path: '/admin/education', icon: 'graduation-cap' },
    { name: 'Resume', path: '/admin/resume', icon: 'file-text' },
    { name: 'Messages', path: '/admin/messages', icon: 'inbox', badge: true },
    { name: 'Social Links', path: '/admin/social-links', icon: 'share-2' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' }
  ],

  skillCategories: ['Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Mobile', 'Design', 'Other'],
  projectCategories: ['Web App', 'FinTech', 'DevOps', 'Mobile App', 'Full-Stack', 'Open Source', 'Other'],

  socialIcons: [
    { label: 'GitHub', value: 'github' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Twitter / X', value: 'twitter' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Globe / Website', value: 'globe' },
    { label: 'Email', value: 'mail' },
    { label: 'Code', value: 'code-2' }
  ]
};
