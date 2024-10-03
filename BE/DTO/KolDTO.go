package DTO

type KolDTO struct {
	KolID                int64  `gorm:"column:kolid"`
	UserProfileID        int64  `gorm:"column:userprofileid"`
	Language             string `gorm:"column:language"`
	Education            string `gorm:"column:education"`
	ExpectedSalary       int64  `gorm:"column:expectedsalary"`
	ExpectedSalaryEnable bool   `gorm:"column:expectedsalaryenable"`
	ChannelSettingTypeID int64  `gorm:"column:channelsettingtypeid"`
	IDFrontURL           string `gorm:"column:idfronturl"`
	IDBackURL            string `gorm:"column:idbackurl"`
	PortraitURL          string `gorm:"column:portraiturl"`
	RewardID             int64  `gorm:"column:rewardid"`
	PaymentMethodID      int64  `gorm:"column:paymentmethodid"`
	TestimonialsID       int64  `gorm:"column:testimonialsid"`
	VerificationStatus   string `gorm:"-"` // Ignored by GORM, will be set manually
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
	LivenessStatus       string `gorm:"-"` // Ignored by GORM, will be set manually
}
