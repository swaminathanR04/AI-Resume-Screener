<script setup lang="ts">
const route = useRoute()
const id = route.params.id

function handleLogout() {
  console.log('Logout clicked')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <div class="bg-blue-500 text-white p-4 flex justify-between">
      <div class="flex items-center gap-3">
        <span>Bob Iger</span>
        <button
          @click="handleLogout"
          class="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200 text-sm"
        >
          Log Out
        </button>
      </div>

      <div class="font-bold text-lg">Careers</div>

      <div class="space-x-4">
        <NuxtLink to="/jobs">Home</NuxtLink>
        <NuxtLink to="/notifications">Notifications</NuxtLink>
        <NuxtLink to="/applications" class="underline">Applications</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
      </div>
    </div>

    <div class="bg-gray-300 p-4 flex justify-between">
      <div>
        <p class="font-semibold text-gray-900">
          Software Engineering Intern
        </p>
        <p class="text-sm text-gray-800">
          Dallas, Texas, United States
        </p>
      </div>

      <div class="text-sm text-gray-900 text-right">
        <p>Status: In Review</p>
        <p>Applied on 3/5/2026</p>
      </div>

      <div class="text-right text-sm">
        <p class="text-blue-600 cursor-pointer hover:underline">
          Edit Application
        </p>
        <p class="text-red-600 cursor-pointer hover:underline">
          Withdraw Application
        </p>
      </div>
    </div>

    <div class="p-6 grid grid-cols-3 gap-6 text-sm text-gray-900">

      <div class="space-y-4">
        <div>
          <h3 class="font-bold">Applicant Information</h3>
          <p>Name: Bob Iger</p>
          <p>Location: Dallas, Texas</p>
          <p>Email: bob.iger@email.com</p>
          <p>Phone: (214) 555-4821</p>
        </div>

        <div>
          <h3 class="font-bold">Job Information</h3>
          <p>Job Title: Software Engineering Intern</p>
          <p>Location: Dallas, Texas</p>
          <p>Employment Type: Internship</p>
        </div>

        <div>
          <h3 class="font-bold">Application Date</h3>
          <p>March 5, 2026</p>
          <p>Status: In Review</p>
        </div>

        <div>
          <h3 class="font-bold">Education</h3>
          <p>B.S. Computer Science – UT Dallas</p>
          <p>Expected Graduation: May 2027</p>
        </div>

        <div>
          <h3 class="font-bold">Skills</h3>
          <p>Python</p>
          <p>JavaScript</p>
          <p>SQL</p>
          <p>Git</p>
          <p>HTML/CSS</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="font-bold">Experience</h3>
          <p>Software Dev Intern – Lone Star Tech</p>
          <p>Dallas, TX</p>
          <p>May 2025 – August 2025</p>
          <ul class="list-disc ml-5">
            <li>Built backend APIs</li>
            <li>Used Python & JavaScript</li>
            <li>Worked with SQL databases</li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold">Questions</h3>
          <p>Authorized to work? Yes</p>
          <p>Need sponsorship? No</p>
          <p>Can commute? Yes</p>
          <p>Veteran? No</p>
          <p>Disability? Prefer not to answer</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="font-bold">Education Program</h3>
          <p>Computer Science</p>
          <p>University of Texas at Dallas</p>
        </div>

        <div>
          <h3 class="font-bold">Resume</h3>
          <p class="text-blue-600 underline cursor-pointer">
            bob_iger_resume.pdf
          </p>
          <button class="mt-1 bg-gray-300 px-2 py-1 rounded">
            Upload New
          </button>
        </div>

        <div>
          <h3 class="font-bold">Cover Letter</h3>
          <p class="text-blue-600 underline cursor-pointer">
            bob_iger_cl.pdf
          </p>
          <button class="mt-1 bg-gray-300 px-2 py-1 rounded">
            Upload New
          </button>
        </div>
      </div>

    </div>
  </div>
</template>