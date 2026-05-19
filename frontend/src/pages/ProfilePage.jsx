import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, Mail, User, Calendar, Shield } from "lucide-react";

const ProfilePage = () => {
  const { updateProfile, authUser, isUpdatingProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setSelectedImage(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setEditing(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background bg-grid p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your account information</p>
        </div>

        {/* Avatar Card */}
        <Card className="glass-card border-0">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                  <AvatarImage src={selectedImage || authUser?.profilePic || "/avatar.png"} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {authUser?.fullName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0.5 right-0.5 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:opacity-90 transition-opacity"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" id="avatar-upload" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} className="hidden" />
                </label>
              </div>
              <div className="text-center">
                <p className="font-semibold">{authUser?.fullName}</p>
                <p className="text-muted-foreground text-xs">
                  {isUpdatingProfile ? "Uploading..." : "Click the camera to update"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3 h-3" /> Full Name
              </Label>
              {editing ? (
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={authUser?.fullName}
                />
              ) : (
                <div className="text-sm bg-muted/50 px-3 py-2.5 rounded-lg">{authUser?.fullName}</div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email Address
              </Label>
              {editing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={authUser?.email}
                />
              ) : (
                <div className="text-sm bg-muted/50 px-3 py-2.5 rounded-lg">{authUser?.email}</div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              {editing ? (
                <>
                  <Button onClick={handleSave} disabled={isUpdatingProfile} size="sm">
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setEditing(true); setFormData({ fullName: authUser?.fullName || "", email: authUser?.email || "" }); }}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </span>
              <span className="font-medium">
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "N/A"}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Status
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium text-xs">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
