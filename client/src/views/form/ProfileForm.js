import React, { useEffect, useState, useRef } from "react"

// ** Third Party Components
import Wizard from "@components/wizard"
import ProfileFormGeneral from "./ProfileFormGeneral"
import ProfileFormSocial from "./ProfileFormSocial"

const ProfileForm = (props) => {
  // ** Props
  const { regions, cities, tag, profile, setProfile, tabId, activeTab, isWaitScrapeIG, isWaitScrapeYT } = props
  // ** State
  const [stepper, setStepper] = useState(null)
  // ** Ref
  const ref = useRef(null)

  const steps = [
    {
      id: "account-details",
      title: "Generali",
      subtitle: "Dati e target",
      content: (
        <ProfileFormGeneral
          profile={profile}
          setProfile={setProfile}
          regions={regions}
          cities={cities}
          tag={tag}
          stepper={stepper}
          tabId={tabId}
          activeTab={activeTab}
        />
      ),
    },
    {
      id: "social-links",
      title: "Social",
      subtitle: "Piattaforme",
      content: (
        <ProfileFormSocial profile={profile} setProfile={setProfile} tabId={tabId} isWaitScrapeIG={isWaitScrapeIG} isWaitScrapeYT={isWaitScrapeYT} />
      ),
    },
  ]

  return (
    <div className="vertical-wizard">
      <Wizard
        type="vertical"
        ref={ref}
        steps={steps}
        options={{
          linear: false,
        }}
        instance={(el) => setStepper(el)}
      />
    </div>
  )
}

export default ProfileForm
