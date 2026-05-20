"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Globe,
  Info,
  MailPlus,
  Save,
  Search,
  Shield,
  Zap
} from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa6"
import { useSystemSettings, useUpdateSystemSettings } from "../../hooks/use-system-settings"

const settingsSchema = z.object({
  siteName: z.string().min(2, "Site name must be at least 2 characters"),
  siteDescription: z.string().min(10, "Description must be at least 10 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(5, "Invalid phone number"),
  address: z.string().min(5, "Invalid address"),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  defaultLanguage: z.string(),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
  seo: z.object({
    metaTitle: z.string().min(2),
    metaDescription: z.string().min(10),
    keywords: z.string(), // We'll handle comma-separated string in the form
  }),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const { data: settings, isLoading } = useSystemSettings()
  const { mutate: updateSettings, isPending } = useUpdateSystemSettings()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      maintenanceMode: false,
      allowRegistration: true,
      defaultLanguage: "en",
      socialLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
        youtube: "",
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
    },
  })

  useEffect(() => {
    if (settings) {
      form.reset({
        ...settings,
        seo: {
          ...settings.seo,
          keywords: settings.seo.keywords.join(", "),
        },
      })
    }
  }, [settings, form])

  function onSubmit(values: SettingsFormValues) {
    const formattedValues = {
      ...values,
      seo: {
        ...values.seo,
        keywords: values.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      },
    }
    updateSettings(formattedValues)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-xl bg-white/5" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">Manage your platform configuration and branding.</p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isPending ? (
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              General
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Contact & Social
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              SEO
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              System
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general" className="space-y-6">
              <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Branding & Identity
                  </CardTitle>
                  <CardDescription>Basic information about your platform.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" placeholder="e.g. NexLearn" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" placeholder="e.g. en" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Platform Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-white/5 border-white/10 min-h-[100px]"
                            placeholder="Briefly describe your platform..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MailPlus className="w-5 h-5 text-primary" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>How users can reach you.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Social Media Links
                    </CardTitle>
                    <CardDescription>Links to your social profiles.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="socialLinks.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FaFacebook className="w-4 h-4 text-blue-500" /> Facebook
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="socialLinks.twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FaTwitter className="w-4 h-4 text-sky-500" /> Twitter
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="socialLinks.linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FaLinkedin className="w-4 h-4 text-blue-600" /> LinkedIn
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Search Engine Optimization
                  </CardTitle>
                  <CardDescription>Control how your site appears in search results.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seo.metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormDescription>The title that appears in browser tabs and search results.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seo.metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white/5 border-white/10 min-h-[80px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seo.keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" placeholder="education, learning, courses" />
                        </FormControl>
                        <FormDescription>Comma-separated list of keywords.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card className="border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    System Controls
                  </CardTitle>
                  <CardDescription>Sensitive platform-wide toggles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">Maintenance Mode</FormLabel>
                          <FormDescription>
                            When active, only administrators can access the platform.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">Allow New Registrations</FormLabel>
                          <FormDescription>
                            Enable or disable new user account creation.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </Form>
  )
}
