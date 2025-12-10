export const UI_STRINGS = {
  branding: {
    appName: 'Career Tracker',
  },

  pages: {
    dashboard: {
      title: 'Dashboard',
      greeting: (name?: string | null) =>
        name
          ? `Welcome back, ${name}! Here's your application overview.`
          : "Welcome back! Here's your application overview.",
    },
    applications: {
      title: 'Applications',
      subtitle: 'Track and manage all your job applications',
    },
    applicationDetail: {
      notFound: 'Application not found',
    },
  },

  nav: {
    dashboard: 'Dashboard',
    applications: 'Applications',
    jobBrowser: 'Job Browser',
    companies: 'Companies',
    reports: 'Reports',
  },

  forms: {
    application: {
      addTitle: 'Add New Application',
      editTitle: 'Edit Application',
      companyLabel: 'Company',
      companyPlaceholder: 'Search or enter new company',
      companyNoOptions: 'Type to add a new company',
      companyCannotChange: 'Company cannot be changed after creation',
      positionLabel: 'Position Title',
      positionPlaceholder: 'Enter job title',
      dateAppliedLabel: 'Date Applied',
      outcomeLabel: 'Outcome',
      locationLabel: 'Location',
      locationPlaceholder: 'e.g., San Francisco, CA or Remote',
      jobUrlLabel: 'Job Posting URL',
      jobUrlPlaceholder: 'https://...',
    },
    notes: {
      addLabel: 'Add a note',
      addTitle: 'Add Note',
      placeholder: 'Interview went well, follow up next week...',
      stageNotePlaceholder: 'Enter a note for this stage...',
      empty: 'No notes yet. Add your first note above.',
      emptyStage: 'No notes yet. Add your first note below.',
      notesLabel: 'Notes',
    },
    auth: {
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
    },
  },

  buttons: {
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save Changes',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    retry: 'Try again',
    goBack: 'Go back',
    backToApplications: 'Back to Applications',
    addApplication: 'Add Application',
    addNote: 'Add Note',
    completeAndAdvance: 'Complete & Advance',
    markRejected: 'Mark Rejected',
    withdraw: 'Withdraw',
    followUp: 'Follow up',
    confirmDelete: 'Confirm Delete',
    viewOriginalPosting: 'View original posting',
    signIn: 'Sign In',
    signUp: 'Sign up',
    signOut: 'Sign Out',
    continueWithGoogle: 'Continue with Google',
  },

  loading: {
    saving: 'Saving...',
    creating: 'Creating...',
    adding: 'Adding...',
    signingIn: 'Signing In...',
    updating: 'Updating...',
    deleting: 'Deleting...',
    loading: 'Loading...',
  },

  messages: {
    allCompleted: 'All stages completed',
    rejected: 'Application was rejected',
    withdrawn: 'Application was withdrawn',
    offerReceived: 'Offer received! 🎉',
    stageClickHint: 'Click any stage to add notes',
    allUpToDate: 'All applications are up to date!',
    needsAttention: (days: number) => `Applications with no updates in ${days}+ days`,
    noApplications: 'No applications yet',
    noActivity: 'No recent activity',
  },

  auth: {
    welcomeBack: 'Welcome back',
    signInSubtitle: 'Sign in to your career tracker account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
  },

  errors: {
    global: {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    },
    pageLoad: {
      title: 'Unable to load this page',
      description: 'Something went wrong while loading this section. You can try again or go back to the dashboard.',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you are looking for does not exist.',
    },
    validation: {
      required: (field: string) => `${field} is required`,
      invalidEmail: 'Please enter a valid email address',
      minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
    },
  },

  dashboard: {
    stats: {
      totalApplications: 'Total Applications',
      offersReceived: 'Offers Received',
      pending: 'Pending',
      responseRate: 'Response Rate',
    },
    sections: {
      stageDistribution: 'Application Stage Distribution',
      staleApplications: 'Needs Attention',
      recentActivity: 'Recent Activity',
    },
  },

  tables: {
    applications: {
      company: 'Company',
      position: 'Position',
      dateApplied: 'Date Applied',
      currentStage: 'Current Stage',
      outcome: 'Outcome',
      location: 'Location',
      actions: 'Actions',
    },
  },

  outcomes: {
    inProgress: 'In Progress (no outcome yet)',
    offer: 'Offer Received',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  },

  stageStatus: {
    completed: 'Completed',
    rejected: 'Rejected',
    inProgress: 'In Progress',
    upcoming: 'Upcoming',
  },

  a11y: {
    closeDialog: 'Close dialog',
    closeModal: 'Close modal',
    openMenu: 'Open menu',
    toggleTheme: 'Toggle theme',
    signOut: 'Sign out of your account',
  },
} as const

export type UIStrings = typeof UI_STRINGS
