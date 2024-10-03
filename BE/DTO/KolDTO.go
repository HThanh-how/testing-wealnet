package DTO

type KolDTO struct {
    KolID                int    `gorm:"column:kolid"`
    UserProfileID        int    `gorm:"column:userprofileid"`
    Language             string `gorm:"column:language"`
    Education            string `gorm:"column:education"`
    ExpectedSalary       int    `gorm:"column:expectedsalary"`
    ExpectedSalaryEnable bool   `gorm:"column:expectedsalaryenable"`
    ChannelSettingTypeID int    `gorm:"column:channelsettingtypeid"`
    IDFrontURL           string `gorm:"column:idfronturl"`
    IDBackURL            string `gorm:"column:idbackurl"`
    PortraitURL          string `gorm:"column:portraiturl"`
    RewardID             int    `gorm:"column:rewardid"`
    PaymentMethodID      int    `gorm:"column:paymentmethodid"`
    TestimonialsID       int    `gorm:"column:testimonialsid"`
    VerificationStatus   bool   `gorm:"column:verificationstatus"`
    Enabled              bool   `gorm:"column:enabled"`
    ActiveDate           string `gorm:"column:activedate"`
    Active               bool   `gorm:"column:active"`
    CreatedBy            string `gorm:"column:createdby"`
    CreatedDate          string `gorm:"column:createddate"`
    ModifiedBy           string `gorm:"column:modifiedby"`
    ModifiedDate         string `gorm:"column:modifieddate"`
    IsRemove             bool   `gorm:"column:isremove"`
    IsOnBoarding         bool   `gorm:"column:isonboarding"`
    Code                 string `gorm:"column:code"`
    PortraitRightURL     string `gorm:"column:portraitrighturl"`
    PortraitLeftURL      string `gorm:"column:portraitlefturl"`
    LivenessStatus       bool   `gorm:"column:livenessstatus"`
}