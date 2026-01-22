
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateProfileSchema, type UpdateProfileInput } from "@team-up/validation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { trpc } from "@/lib/trpc/client"
import { useRouter } from "next/navigation"

export function ProfileForm() {
    const router = useRouter();
    const utils = trpc.useUtils();
    
    // Fetch current user data
    const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    
    const { mutate: updateUser, isPending: isSaving } = trpc.user.update.useMutation({
        onSuccess: () => {
             utils.user.me.invalidate();
             // Ideally show a toast here
             alert("Profile updated successfully!");
        },
        onError: (error) => {
            alert(`Error updating profile: ${error.message}`);
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
        values: {
            name: user?.name || "",
            email: user?.email || "",
        },
    })

    function onSubmit(data: UpdateProfileInput) {
        updateUser(data);
    }

    if (isLoading) {
        return <div>Loading profile...</div>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Your name"
                        {...register("name")}
                        disabled={isSaving}
                    />
                     {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        placeholder="Your email"
                        {...register("email")}
                        disabled={true} // Email is read-only for now
                    />
                     {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Email managed via Google Auth.
                    </p>
                </div>
            </div>
            
            <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Update profile"}
            </Button>
        </form>
    )
}
