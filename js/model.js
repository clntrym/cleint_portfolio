// Data Models & Services Layer
const AppModel = {
  // Projects
  Projects: {
    getAll(params = {}) {
      return AppApi.get('api/projects.php', params);
    },
    getBySlug(slug) {
      return AppApi.get('api/projects.php', { slug });
    },
    getById(id) {
      return AppApi.get('api/projects.php', { id });
    },
    create(data) {
      return AppApi.post('api/projects.php', data);
    },
    update(id, data) {
      return AppApi.post(`api/projects.php?action=update&id=${id}`, data);
    },
    delete(id) {
      return AppApi.post(`api/projects.php?action=delete&id=${id}`);
    },
    toggleStatus(id) {
      return AppApi.post(`api/projects.php?action=toggle_status&id=${id}`);
    },
    toggleFeatured(id) {
      return AppApi.post(`api/projects.php?action=toggle_featured&id=${id}`);
    },
    reorder(orders) {
      return AppApi.post('api/projects.php?action=reorder', { orders });
    }
  },

  // Skills
  Skills: {
    getAll(adminView = false) {
      return AppApi.get('api/skills.php', adminView ? { admin_view: 1 } : {});
    },
    create(data) {
      return AppApi.post('api/skills.php', data);
    },
    update(id, data) {
      return AppApi.post(`api/skills.php?action=update&id=${id}`, data);
    },
    delete(id) {
      return AppApi.post(`api/skills.php?action=delete&id=${id}`);
    },
    toggleStatus(id) {
      return AppApi.post(`api/skills.php?action=toggle_status&id=${id}`);
    }
  },

  // Experience
  Experience: {
    getAll(adminView = false) {
      return AppApi.get('api/experience.php', adminView ? { admin_view: 1 } : {});
    },
    create(data) {
      return AppApi.post('api/experience.php', data);
    },
    update(id, data) {
      return AppApi.post(`api/experience.php?action=update&id=${id}`, data);
    },
    delete(id) {
      return AppApi.post(`api/experience.php?action=delete&id=${id}`);
    },
    toggleStatus(id) {
      return AppApi.post(`api/experience.php?action=toggle_status&id=${id}`);
    }
  },

  // Education
  Education: {
    getAll() {
      return AppApi.get('api/education.php');
    },
    create(data) {
      return AppApi.post('api/education.php', data);
    },
    update(id, data) {
      return AppApi.post(`api/education.php?action=update&id=${id}`, data);
    },
    delete(id) {
      return AppApi.post(`api/education.php?action=delete&id=${id}`);
    }
  },

  // Profile
  Profile: {
    get() {
      return AppApi.get('api/profile.php');
    },
    update(data) {
      return AppApi.post('api/profile.php', data);
    }
  },

  // Messages
  Messages: {
    submit(data) {
      return AppApi.post('api/messages.php', data);
    },
    getAll(params = {}) {
      return AppApi.get('api/messages.php', params);
    },
    toggleRead(id) {
      return AppApi.post(`api/messages.php?action=toggle_read&id=${id}`);
    },
    markAllRead() {
      return AppApi.post('api/messages.php?action=mark_all_read');
    },
    delete(id) {
      return AppApi.post(`api/messages.php?action=delete&id=${id}`);
    }
  },

  // Social Links
  SocialLinks: {
    getAll(adminView = false) {
      return AppApi.get('api/social_links.php', adminView ? { admin_view: 1 } : {});
    },
    create(data) {
      return AppApi.post('api/social_links.php', data);
    },
    update(id, data) {
      return AppApi.post(`api/social_links.php?action=update&id=${id}`, data);
    },
    delete(id) {
      return AppApi.post(`api/social_links.php?action=delete&id=${id}`);
    },
    toggleStatus(id) {
      return AppApi.post(`api/social_links.php?action=toggle_status&id=${id}`);
    }
  },

  // Settings
  Settings: {
    get() {
      return AppApi.get('api/settings.php');
    },
    update(data) {
      return AppApi.post('api/settings.php', data);
    }
  },

  // Stats
  Stats: {
    get() {
      return AppApi.get('api/stats.php');
    }
  },

  // Resume
  Resume: {
    get() {
      return AppApi.get('api/resume.php');
    },
    upload(file) {
      return AppApi.uploadResume(file);
    },
    delete() {
      return AppApi.post('api/resume.php?action=delete');
    }
  }
};
